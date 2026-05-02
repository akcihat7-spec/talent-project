'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface DemoTalent {
  id: string
  name: string
  title: string
  expertise: string[]
  dailyRate: number
  rating: number
  projects: number
  description: string
  status: 'available' | 'busy' | 'offline'
}

const demoTalents: DemoTalent[] = [
  {
    id: '1',
    name: 'ReactMaster AI',
    title: 'Senior React Developer AI',
    expertise: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    dailyRate: 250,
    rating: 4.9,
    projects: 142,
    description: 'Uzman düzeyde React uygulamaları geliştiren, modern frontend teknolojilerinde uzmanlaşmış yapay zeka.',
    status: 'available'
  },
  {
    id: '2',
    name: 'PythonExpert AI',
    title: 'Python Automation Expert AI',
    expertise: ['Python', 'Django', 'FastAPI', 'Machine Learning'],
    dailyRate: 300,
    rating: 4.8,
    projects: 98,
    description: 'Otomasyon ve veri analizi projelerinde uzman, Python ekosisteminde derin bilgi birikimine sahip AI.',
    status: 'available'
  },
  {
    id: '3',
    name: 'CloudArchitect AI',
    title: 'DevOps & Cloud Architect AI',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    dailyRate: 350,
    rating: 5.0,
    projects: 76,
    description: 'Bulut altyapı tasarımı ve DevOps süreçlerinde uzman, ölçeklenebilir sistemler geliştirir.',
    status: 'busy'
  }
]

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Yükleniyor...</div>
      </div>
    )
  }

  // Eğer kullanıcı yönlendiriliyorsa, ana sayfa içeriğini göster
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Arka plan animasyonu */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Ana içerik */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="backdrop-blur-md bg-white/10 border border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <span className="text-white font-bold text-xl">TalentAI</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-white/80 hover:text-white transition-colors">
                  Yetenekler
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  Hakkımızda
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                >
                  Giriş Yap
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Kayıt Ol
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Dünyanın İlk
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Yapay Zeka Yetenek Pazaryeri
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              GitHub profilini analiz ederek kişisel AI yetenekleri oluştur. 
              Dünyanın dört bir yanındaki projelerde çalış, 
              yeteneklerini pazara çıkar ve gelir elde et.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all transform hover:scale-105"
              >
                Yetenekleri Keşfet
              </button>
              <button className="backdrop-blur-md bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all">
                Nasıl Çalışır?
              </button>
            </div>
          </div>
        </section>

        {/* Demo Talent Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Popüler AI Yetenekler
            </h2>
            <p className="text-white/80">
              GitHub profili analiz edilerek oluşturulan uzman yapay zeka yetenekleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTalents.map((talent) => (
              <div
                key={talent.id}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{talent.name}</h3>
                    <p className="text-white/80">{talent.title}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    talent.status === 'available' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : talent.status === 'busy'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {talent.status === 'available' ? 'Müsait' : talent.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
                  </span>
                </div>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {talent.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {talent.expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-4 text-white/60 text-sm">
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{talent.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📁</span>
                      <span>{talent.projects}</span>
                    </div>
                  </div>
                  <div className="text-white font-bold">
                    ${talent.dailyRate}/gün
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all">
              Tüm Yetenekleri Gör
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Tabanlı</h3>
              <p className="text-white/70">
                GitHub profilini analiz ederek kişisel AI yetenekleri oluştur
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gelir Elde Et</h3>
              <p className="text-white/70">
                Yeteneklerini pazara çıkar ve projelerden gelir elde et
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Küresel Pazar</h3>
              <p className="text-white/70">
                Dünyanın dört bir yanındaki projelerde çalış
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
