import { prisma } from '@/lib/prisma'
import { currentUser } from '@/lib/auth'

async function getScoresForUser(userId: string) {
  const client = await prisma.client.findFirst({ where: { userId }, include: { scores: true } })
  return client?.scores ?? []
}

export default async function HomePage() {
  const user = await currentUser()
  let scores: { bureau: string; score: number }[] = []
  if (user) {
    const raw = await getScoresForUser(user.id)
    scores = raw.map((s) => ({ bureau: s.bureau, score: s.score }))
  }
  const bureaus = ['Equifax', 'Illion', 'Experian']
  return (
    <section className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-2">Your Credit Score</h1>
          {scores.length === 0 ? (
            <p className="text-muted-foreground">No scores yet – upload a credit report to see your score.</p>
          ) : (
            <p>Your latest score is {Math.max(...scores.map((s) => s.score))}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bureaus.map((bureau) => {
          const score = scores.find((s) => s.bureau === bureau)?.score
          return (
            <div key={bureau} className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">{bureau}</h2>
              {score === undefined ? (
                <span className="text-muted-foreground">–</span>
              ) : (
                <span className="text-4xl font-bold text-primary">{score}</span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}