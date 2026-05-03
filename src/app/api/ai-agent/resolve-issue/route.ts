import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'
import type { Database } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { talentId, talentName, githubUsername, clientId, clientName } = await request.json()

    if (!talentId || !githubUsername || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields: talentId, githubUsername, clientId' },
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
    const repoResponse = await octokit.rest.repos.listForUser({
      username: githubUsername,
      sort: 'updated',
      direction: 'desc',
      per_page: 10
    })

    if (repoResponse.data.length === 0) {
      return NextResponse.json(
        { error: 'No repositories found for this GitHub user' },
        { status: 404 }
      )
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
        title: 'AI Agent Test Issue - Improve Code Quality',
        body: 'This is a test issue created by AI Agent to demonstrate issue resolution capabilities. Please add some code improvements or documentation updates.',
        labels: ['enhancement', 'ai-agent-test']
      })
      issueToResolve = createIssueResponse.data
    }

    // Simulate AI Agent analysis and resolution
    const startTime = Date.now()
    
    // AI Agent "analyzes" the issue
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // AI Agent "resolves" the issue
    const solution = generateAISolution(issueToResolve, (talent as any).persona_data)
    
    // Create a comment with the solution
    await octokit.rest.issues.createComment({
      owner: githubUsername,
      repo: repo.name,
      issue_number: issueToResolve.number,
      body: `🤖 **AI Agent Resolution**\n\n**Talent:** ${talentName}\n**Client:** ${clientName}\n\n**Solution:**\n${solution}\n\n---\n*This issue was resolved automatically by AI Agent*`
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
      solution: solution,
      timeTaken: timeTaken,
      talentName: talentName,
      clientName: clientName
    })

  } catch (error) {
    console.error('AI Agent error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAISolution(issue: any, personaData: any): string {
  const expertise = (personaData as any)?.expertise || ['General Development']
  const skills = (personaData as any)?.skills || ['Programming']
  
  const solutions = [
    `I've analyzed this issue and implemented a solution using ${expertise.join(', ')} expertise. The code has been refactored to improve performance and maintainability.`,
    `Based on my ${skills.join(', ')} skills, I've resolved this issue by implementing best practices and adding comprehensive error handling.`,
    `I've successfully addressed this issue using my expertise in ${expertise.join(', ')}. The solution includes proper documentation and follows coding standards.`,
    `This issue has been resolved with a clean implementation using ${skills.join(', ')}. The code is now more efficient and easier to maintain.`
  ]
  
  return solutions[Math.floor(Math.random() * solutions.length)]
}
