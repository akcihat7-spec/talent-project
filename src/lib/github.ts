import { Octokit } from '@octokit/rest'

export interface GitHubAnalysis {
  topRepositories: Repository[]
  languageStats: LanguageStats
  codingPatterns: CodingPatterns
  commitStyle: CommitStyle
  activityHours: ActivityHours
}

export interface Repository {
  name: string
  fullName: string
  description: string | null
  language: string | null
  stargazersCount: number
  forksCount: number
  commitsCount: number
  contributionCount: number
  url: string
}

export interface LanguageStats {
  languages: Record<string, number>
  primaryLanguage: string
  techStack: string[]
}

export interface CodingPatterns {
  mostActiveHours: number[]
  preferredDays: string[]
  averageCommitsPerDay: number
  commitFrequency: 'low' | 'medium' | 'high'
}

export interface CommitStyle {
  averageMessageLength: number
  messageStyle: 'short' | 'medium' | 'detailed'
  commonPrefixes: string[]
  hasConventionalCommits: boolean
}

export interface ActivityHours {
  hourlyDistribution: Record<number, number>
  peakHours: number[]
  timezone: string
}

export class GitHubAnalyzer {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken })
  }

  async analyzeUserGitHub(username: string): Promise<GitHubAnalysis> {
    try {
      // 1. Kullanıcının repolarını çek
      const repositories = await this.getUserTopRepositories(username)
      
      // 2. Dil analizini yap
      const languageStats = await this.analyzeLanguages(repositories)
      
      // 3. Commit pattern'lerini analiz et
      const codingPatterns = await this.analyzeCodingPatterns(username, repositories)
      
      // 4. Commit stilini analiz et
      const commitStyle = await this.analyzeCommitStyle(username, repositories)
      
      // 5. Aktivite saatlerini analiz et
      const activityHours = await this.analyzeActivityHours(username, repositories)

      return {
        topRepositories: repositories,
        languageStats,
        codingPatterns,
        commitStyle,
        activityHours
      }
    } catch (error) {
      console.error('GitHub analiz hatası:', error)
      throw new Error('GitHub analizi başarısız oldu')
    }
  }

  private async getUserTopRepositories(username: string): Promise<Repository[]> {
    try {
      const { data: repos } = await this.octokit.rest.repos.listForUser({
        username,
        type: 'owner',
        sort: 'updated',
        direction: 'desc',
        per_page: 100
      })

      // Her repo için commit sayısını al
      const repositoriesWithCommits = await Promise.all(
        repos.slice(0, 20).map(async (repo) => {
          try {
            const { data: commits } = await this.octokit.rest.repos.listCommits({
              owner: username,
              repo: repo.name,
              per_page: 1
            })

            // Contribution count (kullanıcının kendi commit'leri)
            let contributionCount = 0
            try {
              const { data: stats } = await this.octokit.rest.repos.getContributorsStats({
                owner: username,
                repo: repo.name
              })
              
              const userStats = stats.find((stat: any) => stat.author?.login === username)
              contributionCount = userStats?.total || 0
            } catch {
              // Stats yoksa 0 olarak kabul et
            }

            return {
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              language: repo.language || null,
              stargazersCount: repo.stargazers_count || 0,
              forksCount: repo.forks_count || 0,
              commitsCount: commits.length || 0,
              contributionCount,
              url: repo.html_url
            }
          } catch {
            return {
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              language: repo.language || null,
              stargazersCount: repo.stargazers_count || 0,
              forksCount: repo.forks_count || 0,
              commitsCount: 0,
              contributionCount: 0,
              url: repo.html_url
            }
          }
        })
      )

      // Contribution sayısına göre sırala ve ilk 5'i al
      return repositoriesWithCommits
        .sort((a, b) => b.contributionCount - a.contributionCount)
        .slice(0, 5)
    } catch (error) {
      console.error('Repo çekme hatası:', error)
      return []
    }
  }

  private async analyzeLanguages(repositories: Repository[]): Promise<LanguageStats> {
    const languages: Record<string, number> = {}
    
    // Her repodaki dilleri analiz et
    for (const repo of repositories) {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + repo.contributionCount
      }
    }

    // En çok kullanılan dili bul
    const primaryLanguage = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown'

    // Tech stack'i belirle
    const techStack = this.determineTechStack(languages)

    return {
      languages,
      primaryLanguage,
      techStack
    }
  }

  private determineTechStack(languages: Record<string, number>): string[] {
    const stack: string[] = []
    
    // Dil bazında tech stack belirleme
    if (languages['JavaScript'] || languages['TypeScript']) {
      stack.push('JavaScript/TypeScript')
      if (languages['React'] || languages['Vue'] || languages['Angular']) {
        stack.push('Frontend Framework')
      }
      if (languages['Node.js']) {
        stack.push('Node.js')
      }
    }
    
    if (languages['Python']) {
      stack.push('Python')
      if (languages['Django'] || languages['Flask']) {
        stack.push('Python Web Framework')
      }
    }
    
    if (languages['Java']) {
      stack.push('Java')
    }
    
    if (languages['C++'] || languages['C#']) {
      stack.push('C++/C#')
    }
    
    if (languages['Go']) {
      stack.push('Go')
    }
    
    if (languages['Rust']) {
      stack.push('Rust')
    }
    
    if (languages['Dockerfile']) {
      stack.push('Docker')
    }
    
    if (languages['Shell']) {
      stack.push('Shell Scripting')
    }

    return stack.length > 0 ? stack : ['General Programming']
  }

  private async analyzeCodingPatterns(username: string, repositories: Repository[]): Promise<CodingPatterns> {
    const hourlyDistribution: Record<number, number> = {}
    const dayDistribution: Record<string, number> = {}
    let totalCommits = 0
    let activeDays = 0

    // Son 30 gündeki commit'leri çek
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    for (const repo of repositories.slice(0, 3)) { // İlk 3 repo'yu analiz et
      try {
        const { data: commits } = await this.octokit.rest.repos.listCommits({
          owner: username,
          repo: repo.name,
          since: thirtyDaysAgo.toISOString(),
          per_page: 100
        })

        commits.forEach(commit => {
          if (commit.commit?.author?.date) {
            const date = new Date(commit.commit.author.date)
            const hour = date.getHours()
            const day = date.toLocaleDateString('en-US', { weekday: 'long' })

            hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
            dayDistribution[day] = (dayDistribution[day] || 0) + 1
            totalCommits++
          }
        })
      } catch (error) {
        console.error(`Commit analizi hatası - ${repo.name}:`, error)
      }
    }

    // En aktif saatleri bul
    const mostActiveHours = Object.entries(hourlyDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))

    // Tercih edilen günleri bul
    const preferredDays = Object.entries(dayDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day)

    // Commit frekansını belirle
    const averageCommitsPerDay = totalCommits / 30
    let commitFrequency: 'low' | 'medium' | 'high' = 'low'
    
    if (averageCommitsPerDay > 5) {
      commitFrequency = 'high'
    } else if (averageCommitsPerDay > 2) {
      commitFrequency = 'medium'
    }

    return {
      mostActiveHours,
      preferredDays,
      averageCommitsPerDay,
      commitFrequency
    }
  }

  private async analyzeCommitStyle(username: string, repositories: Repository[]): Promise<CommitStyle> {
    let totalMessageLength = 0
    let commitCount = 0
    const prefixes: Record<string, number> = {}
    let conventionalCommits = 0

    for (const repo of repositories.slice(0, 3)) { // İlk 3 repo'yu analiz et
      try {
        const { data: commits } = await this.octokit.rest.repos.listCommits({
          owner: username,
          repo: repo.name,
          per_page: 50
        })

        commits.forEach(commit => {
          if (commit.commit?.message) {
            const message = commit.commit.message
            const firstLine = message.split('\n')[0]
            
            totalMessageLength += firstLine.length
            commitCount++

            // Prefix analiz et
            const match = firstLine.match(/^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:/)
            if (match) {
              conventionalCommits++
              prefixes[match[1]] = (prefixes[match[1]] || 0) + 1
            } else {
              // Non-conventional prefix'leri de analiz et
              const words = firstLine.split(' ')
              if (words.length > 0) {
                const firstWord = words[0].toLowerCase()
                prefixes[firstWord] = (prefixes[firstWord] || 0) + 1
              }
            }
          }
        })
      } catch (error) {
        console.error(`Commit stil analizi hatası - ${repo.name}:`, error)
      }
    }

    const averageMessageLength = commitCount > 0 ? totalMessageLength / commitCount : 0
    
    // Mesaj stilini belirle
    let messageStyle: 'short' | 'medium' | 'detailed' = 'medium'
    if (averageMessageLength < 30) {
      messageStyle = 'short'
    } else if (averageMessageLength > 70) {
      messageStyle = 'detailed'
    }

    // En sık kullanılan prefix'leri bul
    const commonPrefixes = Object.entries(prefixes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([prefix]) => prefix)

    const hasConventionalCommits = conventionalCommits > commitCount * 0.3

    return {
      averageMessageLength,
      messageStyle,
      commonPrefixes,
      hasConventionalCommits
    }
  }

  private async analyzeActivityHours(username: string, repositories: Repository[]): Promise<ActivityHours> {
    const hourlyDistribution: Record<number, number> = {}

    for (let hour = 0; hour < 24; hour++) {
      hourlyDistribution[hour] = 0
    }

    // Son 100 commit'i analiz et
    for (const repo of repositories.slice(0, 3)) {
      try {
        const { data: commits } = await this.octokit.rest.repos.listCommits({
          owner: username,
          repo: repo.name,
          per_page: 100
        })

        commits.forEach(commit => {
          if (commit.commit?.author?.date) {
            const date = new Date(commit.commit.author.date)
            const hour = date.getHours()
            hourlyDistribution[hour]++
          }
        })
      } catch (error) {
        console.error(`Aktivite saati analizi hatası - ${repo.name}:`, error)
      }
    }

    // Peak saatleri bul
    const peakHours = Object.entries(hourlyDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))

    return {
      hourlyDistribution,
      peakHours,
      timezone: 'UTC' // GitHub UTC verir, kullanıcı local timezone'ine çevrilebilir
    }
  }
}
