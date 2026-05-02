import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { GitHubAnalyzer } from '@/lib/github'
import type { Database } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { githubUsername, githubAccessToken, userId } = await request.json()

    if (!githubUsername || !githubAccessToken || !userId) {
      return NextResponse.json(
        { error: 'GitHub username, access token, and user ID are required' },
        { status: 400 }
      )
    }

    // GitHub analizini yap
    const analyzer = new GitHubAnalyzer(githubAccessToken)
    const analysis = await analyzer.analyzeUserGitHub(githubUsername)

    // Supabase admin client oluştur
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Önce kullanıcının profilini kontrol et
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Sadece talent'lar synthetic talent oluşturabilir
    if ((profile as any).role !== 'talent') {
      return NextResponse.json(
        { error: 'Only talents can create synthetic talent profiles' },
        { status: 403 }
      )
    }

    // Persona data'yı oluştur
    const personaData = {
      githubAnalysis: {
        username: githubUsername,
        topRepositories: analysis.topRepositories,
        languageStats: analysis.languageStats,
        codingPatterns: analysis.codingPatterns,
        commitStyle: analysis.commitStyle,
        activityHours: analysis.activityHours,
        analyzedAt: new Date().toISOString()
      },
      // Persona özelliklerini GitHub analizinden türet
      persona: {
        name: `${githubUsername} AI`,
        expertise: analysis.languageStats.techStack,
        primaryLanguage: analysis.languageStats.primaryLanguage,
        workStyle: {
          frequency: analysis.codingPatterns.commitFrequency,
          preferredHours: analysis.codingPatterns.mostActiveHours,
          preferredDays: analysis.codingPatterns.preferredDays,
          messageStyle: analysis.commitStyle.messageStyle
        },
        characteristics: {
          detailOriented: analysis.commitStyle.messageStyle === 'detailed',
          organized: analysis.commitStyle.hasConventionalCommits,
          productive: analysis.codingPatterns.commitFrequency === 'high',
          nightOwl: analysis.codingPatterns.mostActiveHours.some(hour => hour >= 22 || hour <= 6),
          earlyBird: analysis.codingPatterns.mostActiveHours.some(hour => hour >= 6 && hour <= 9)
        },
        // Günlük ücreti expertise seviyesine göre belirle
        dailyRate: calculateDailyRate(analysis.languageStats, analysis.codingPatterns)
      }
    }

    // Önce bu kullanıcı için var olan synthetic talent'i kontrol et
    const { data: existingTalent, error: existingError } = await (supabaseAdmin as any)
      .from('synthetic_talents')
      .select('id')
      .eq('owner_id', userId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      // PGRST116 = not found, diğer hatalar gerçek hatalardır
      console.error('Existing talent check error:', existingError)
      return NextResponse.json(
        { error: 'Database error during talent check' },
        { status: 500 }
      )
    }

    let syntheticTalent

    if (existingTalent) {
      // Mevcut talent'i güncelle
      const { data: updatedTalent, error: updateError } = await (supabaseAdmin as any)
        .from('synthetic_talents')
        .update({
          persona_data: personaData,
          daily_rate: personaData.persona.dailyRate,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTalent.id)
        .select()
        .single()

      if (updateError) {
        console.error('Talent update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update synthetic talent' },
          { status: 500 }
        )
      }

      syntheticTalent = updatedTalent
    } else {
      // Yeni synthetic talent oluştur
      const { data: newTalent, error: insertError } = await (supabaseAdmin as any)
        .from('synthetic_talents')
        .insert({
          owner_id: userId,
          persona_data: personaData,
          daily_rate: personaData.persona.dailyRate,
          status: 'active'
        })
        .select()
        .single()

      if (insertError) {
        console.error('Talent creation error:', insertError)
        return NextResponse.json(
          { error: 'Failed to create synthetic talent' },
          { status: 500 }
        )
      }

      syntheticTalent = newTalent
    }

    return NextResponse.json({
      success: true,
      message: 'GitHub analysis completed and synthetic talent created/updated',
      syntheticTalent,
      analysis: {
        topRepositories: analysis.topRepositories.length,
        primaryLanguage: analysis.languageStats.primaryLanguage,
        techStack: analysis.languageStats.techStack,
        workStyle: analysis.codingPatterns.commitFrequency,
        dailyRate: personaData.persona.dailyRate
      }
    })

  } catch (error) {
    console.error('GitHub analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error during GitHub analysis' },
      { status: 500 }
    )
  }
}

// Günlük ücreti hesaplama fonksiyonu
function calculateDailyRate(languageStats: any, codingPatterns: any): number {
  let baseRate = 50 // Başlangıç ücreti

  // Popüler diller için ek ücret
  const highValueLanguages = ['TypeScript', 'Go', 'Rust', 'Python', 'Java']
  const mediumValueLanguages = ['JavaScript', 'C#', 'C++', 'Swift', 'Kotlin']

  if (highValueLanguages.includes(languageStats.primaryLanguage)) {
    baseRate += 100
  } else if (mediumValueLanguages.includes(languageStats.primaryLanguage)) {
    baseRate += 50
  }

  // Tech stack karmaşıklığı için ek ücret
  baseRate += languageStats.techStack.length * 20

  // Commit frekansı için bonus
  if (codingPatterns.commitFrequency === 'high') {
    baseRate += 50
  } else if (codingPatterns.commitFrequency === 'medium') {
    baseRate += 25
  }

  // Organizasyonel özellikler için bonus
  if (codingPatterns.messageStyle === 'detailed') {
    baseRate += 30
  }

  // Maksimum ve minimum sınırlar
  return Math.min(Math.max(baseRate, 50), 500)
}
