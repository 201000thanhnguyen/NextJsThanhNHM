'use client'

import { useEffect, useRef, useState } from 'react'
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google'
import { get } from 'http'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})


/* ---------- Lunar helper ---------- */
function getLunarNewYearDate(year: number) {
  const map: Record<number, string> = {
    2025: '2025-01-29',
    2026: '2026-02-17',
    2027: '2027-02-06',
    2028: '2028-01-26',
    2029: '2029-02-13',
  }
  return new Date(map[year] ?? `${year}-02-01`)
}

function getCurrentLunarYear() {
  const now = new Date()
  const year = now.getFullYear()
  const lunarNewYearThisYear = getLunarNewYearDate(year)

  // nếu chưa tới Tết Âm → vẫn là năm âm hiện tại
  if (now < lunarNewYearThisYear) {
    return year
  }

  // đã qua Tết → sang năm âm tiếp theo
  return year + 1
}

const ZODIAC = [
  'Tý 🐭', 'Sửu 🐮', 'Dần 🐯', 'Mão 🐰', 'Thìn 🐲', 'Tỵ 🐍',
  'Ngọ 🐴', 'Mùi 🐐', 'Thân 🐒', 'Dậu 🐓', 'Tuất 🐶', 'Hợi 🐷',
]

const HEAVENLY_STEMS = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
]

const EARTHLY_BRANCHES = [
  'Tý 🐭', 'Sửu 🐮', 'Dần 🐯', 'Mão 🐰', 'Thìn 🐲', 'Tỵ 🐍',
  'Ngọ 🐴', 'Mùi 🐐', 'Thân 🐒', 'Dậu 🐓', 'Tuất 🐶', 'Hợi 🐷',
]


const getZodiac = (year: number) => ZODIAC[(year - 4) % 12]

function getCanChi(year: number) {
  const stem = HEAVENLY_STEMS[(year - 4) % 10]
  const branch = EARTHLY_BRANCHES[(year - 4) % 12]
  return `${stem} ${branch}`
}


/* ---------- Page ---------- */
export default function LunarNewYearPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [show, setShow] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [isNewYear, setIsNewYear] = useState(false)

  const lunarYear = getCurrentLunarYear()
  const lunarDate = getLunarNewYearDate(lunarYear)

  /* fade in */
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300)
    return () => clearTimeout(t)
  }, [])

  /* countdown */
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = +lunarDate - +new Date()
      if (diff <= 0) {
        setIsNewYear(true)
        setTimeLeft('🎉 CHÚC MỪNG NĂM MỚI 🎉')
        clearInterval(timer)
        return
      }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff / 3600000) % 24)
      const m = Math.floor((diff / 60000) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`)
    }, 1000)
    return () => clearInterval(timer)
  }, [lunarDate])

  /* canvas fireworks */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
    }

    let particles: Particle[] = []

    const boom = (x: number, y: number) => {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 60,
          color: `hsl(${Math.random() * 360}, 90%, 60%)`,
        })
      }
    }

    let rafId = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 3, 3)
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.life--
      })

      particles = particles.filter(p => p.life > 0)
      rafId = requestAnimationFrame(draw)
    }

    draw()

    const fireInterval = setInterval(() => {
      boom(Math.random() * window.innerWidth, window.innerHeight * 0.35)
    }, isNewYear ? 600 : 1600)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(fireInterval)
      window.removeEventListener('resize', resize)
    }
  }, [isNewYear])

  return (
    <main
      className={`
        ${beVietnam.className}
        relative
        min-h-[100dvh]
        overflow-hidden
        flex
        items-center
        justify-center
        text-white
      `}
      style={{
        backgroundImage: "url('/danang1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* overlay tối */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* canvas pháo hoa */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* nội dung */}
      <div
        className={`relative z-20 text-center transition-all duration-1000 ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <h1 className="text-3xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          🧧 TẾT NGUYÊN ĐÁN 🧧
        </h1>

        <p className="text-2xl mb-3">
          Năm {lunarYear} – {getCanChi(lunarYear)}
        </p>

        <div className="text-xl font-mono bg-white/20 px-6 py-3 rounded-full inline-block mb-6">
          {timeLeft}
        </div>

        <p className="text-lg opacity-90">
          Chúc bạn năm mới<br />
          <b>an nhiên trong tâm – vững bước ngoài đời</b>
        </p>
      </div>
    </main>
  )

}
