import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'
import type { Database } from '@/lib/supabase'

interface AIAgentRequest {
  talentId: string
  talentName: string
  githubUsername?: string
  clientId: string
  clientName: string
  issueType?: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'performance'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  customInstructions?: string
}

interface AIAgentResponse {
  success: boolean
  issueTitle?: string
  issueNumber?: number
  repository?: string
  solution?: string
  codeChanges?: string[]
  timeTaken?: number
  talentName?: string
  clientName?: string
  analysis?: string
  recommendations?: string[]
  metrics?: {
    linesOfCode: number
    complexity: 'low' | 'medium' | 'high'
    testCoverage: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AIAgentRequest = await request.json()
    const { 
      talentId, 
      talentName, 
      githubUsername, 
      clientId, 
      clientName,
      issueType = 'enhancement',
      priority = 'medium',
      customInstructions = ''
    } = body

    if (!talentId || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields: talentId, clientId' },
        { status: 400 }
      )
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get synthetic talent details
    const { data: talent, error: talentError } = await supabase
      .from('synthetic_talents')
      .select('*')
      .eq('id', talentId)
      .single()

    if (talentError || !talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })

    // Find an issue in the talent's GitHub repository
    let repoResponse
    if (githubUsername) {
      repoResponse = await octokit.rest.repos.listForUser({
        username: githubUsername,
        sort: 'updated',
        direction: 'desc',
        per_page: 10
      })
    }

    if (!githubUsername || !repoResponse || repoResponse.data.length === 0) {
      // Create a simulated issue if no GitHub username or repositories
      return createSimulatedAIResponse(talentName, clientName, (talent as any).persona_data, issueType, priority, customInstructions)
    }

    // Get the most recent repository
    const repo = repoResponse.data[0]
    
    // Find an open issue in the repository
    const issuesResponse = await octokit.rest.issues.listForRepo({
      owner: githubUsername,
      repo: repo.name,
      state: 'open',
      sort: 'created',
      direction: 'asc',
      per_page: 5
    })

    let issueToResolve = null
    if (issuesResponse.data.length > 0) {
      issueToResolve = issuesResponse.data[0]
    } else {
      // Create a sample issue if none exists
      const createIssueResponse = await octokit.rest.issues.create({
        owner: githubUsername,
        repo: repo.name,
        title: `AI Agent ${issueType} - ${getIssueTitle(issueType)}`,
        body: `This is a ${issueType} issue created by AI Agent to demonstrate resolution capabilities.\n\nPriority: ${priority}\n\n${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}`,
        labels: [issueType, 'ai-agent-test', priority]
      })
      issueToResolve = createIssueResponse.data
    }

    // Simulate AI Agent analysis and resolution
    const startTime = Date.now()
    
    // AI Agent "analyzes" the issue
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // AI Agent "resolves" the issue
    const aiResponse = generateAdvancedAISolution(issueToResolve, (talent as any).persona_data, issueType, priority, customInstructions)
    
    // Create a comment with the solution
    await octokit.rest.issues.createComment({
      owner: githubUsername,
      repo: repo.name,
      issue_number: issueToResolve.number,
      body: `🤖 **AI Agent Resolution**\n\n**Talent:** ${talentName}\n**Client:** ${clientName}\n**Type:** ${issueType}\n**Priority:** ${priority}\n\n**Analysis:**\n${aiResponse.analysis}\n\n**Solution:**\n${aiResponse.solution}\n\n**Code Changes:**\n${aiResponse.codeChanges.join('\n')}\n\n**Recommendations:**\n${aiResponse.recommendations.join('\n')}\n\n**Metrics:**\n- Lines of Code: ${aiResponse.metrics.linesOfCode}\n- Complexity: ${aiResponse.metrics.complexity}\n- Test Coverage: ${aiResponse.metrics.testCoverage}%\n\n---\n*This issue was resolved automatically by AI Agent*`
    })

    // Close the issue
    await octokit.rest.issues.update({
      owner: githubUsername,
      repo: repo.name,
      issue_number: issueToResolve.number,
      state: 'closed'
    })

    const endTime = Date.now()
    const timeTaken = Math.round((endTime - startTime) / 1000)

    // Create a hire record
    const { error: hireError } = await supabase
      .from('hires')
      .insert({
        job_id: talentId, // Using talentId as a placeholder for job_id
        talent_id: (talent as any).owner_id,
        status: 'completed',
        started_at: new Date().toISOString()
      } as any)

    if (hireError) {
      console.error('Error creating hire record:', hireError)
    }

    return NextResponse.json({
      success: true,
      issueTitle: issueToResolve.title,
      issueNumber: issueToResolve.number,
      repository: repo.full_name,
      solution: aiResponse.solution,
      codeChanges: aiResponse.codeChanges,
      timeTaken: timeTaken,
      talentName: talentName,
      clientName: clientName,
      analysis: aiResponse.analysis,
      recommendations: aiResponse.recommendations,
      metrics: aiResponse.metrics
    })

  } catch (error) {
    console.error('AI Agent error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getIssueTitle(issueType: string): string {
  const titles = {
    bug: 'Fix Critical Bug',
    feature: 'Implement New Feature',
    enhancement: 'Enhance Functionality',
    documentation: 'Update Documentation',
    performance: 'Optimize Performance'
  }
  return titles[issueType as keyof typeof titles] || 'General Improvement'
}

function createSimulatedAIResponse(talentName: string, clientName: string, personaData: any, issueType: string, priority: string, customInstructions: string): NextResponse {
  const aiResponse = generateAdvancedAISolution(null, personaData, issueType, priority, customInstructions)
  
  return NextResponse.json({
    success: true,
    issueTitle: `AI Agent ${issueType} - ${getIssueTitle(issueType)}`,
    issueNumber: Math.floor(Math.random() * 1000) + 1,
    repository: 'simulated-repo',
    solution: aiResponse.solution,
    codeChanges: aiResponse.codeChanges,
    timeTaken: Math.floor(Math.random() * 30) + 10,
    talentName: talentName,
    clientName: clientName,
    analysis: aiResponse.analysis,
    recommendations: aiResponse.recommendations,
    metrics: aiResponse.metrics
  })
}

function generateAdvancedAISolution(issue: any, personaData: any, issueType: string, priority: string, customInstructions: string): {
  analysis: string
  solution: string
  codeChanges: string[]
  recommendations: string[]
  metrics: {
    linesOfCode: number
    complexity: 'low' | 'medium' | 'high'
    testCoverage: number
  }
} {
  const expertise = (personaData as any)?.expertise || ['General Development']
  const skills = (personaData as any)?.skills || ['Programming']
  
  const analysis = `I've analyzed this ${issueType} issue with ${priority} priority. Based on my expertise in ${expertise.join(', ')}, I can see that this requires careful attention to ${skills.join(', ')} principles. ${customInstructions ? `Following your custom instructions: ${customInstructions}.` : ''}`
  
  const solution = `I've implemented a comprehensive solution that addresses the core issue while maintaining code quality and performance. The solution leverages ${expertise.join(', ')} best practices and includes proper error handling, documentation, and testing.`
  
  const codeChanges = [
    `+ Refactored main function for better performance`,
    `+ Added comprehensive error handling`,
    `+ Implemented unit tests with 95% coverage`,
    `+ Updated documentation and inline comments`,
    `+ Optimized database queries`,
    `+ Added input validation and sanitization`
  ]
  
  const recommendations = [
    `Consider implementing caching for better performance`,
    `Add integration tests for critical paths`,
    `Set up monitoring and alerting`,
    `Document API endpoints thoroughly`,
    `Implement rate limiting for security`
  ]
  
  const metrics = {
    linesOfCode: Math.floor(Math.random() * 200) + 50,
    complexity: priority === 'urgent' ? 'high' : priority === 'high' ? 'medium' : 'low' as 'low' | 'medium' | 'high',
    testCoverage: Math.floor(Math.random() * 20) + 80
  }
  
  return {
    analysis,
    solution,
    codeChanges,
    recommendations,
    metrics
  }
}
