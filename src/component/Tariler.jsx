import React, { useState, useEffect, useRef, useCallback } from 'react'


const TrailerPlayer = ({ trailerKey, poster }) => {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const barRef = useRef(null)
  const [player, setPlayer] = useState(null)

  const [status, setStatus] = useState('unstarted')
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [skipIndicator, setSkipIndicator] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const isPlaying = status === 'playing'
  const showCover = status !== 'playing'

  useEffect(() => {
    let cancelled = false

    const createPlayer = () => {
      if (cancelled || !playerRef.current) return
      new window.YT.Player(playerRef.current, {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          controls: 0,         
          rel: 0,              
          modestbranding: 1,   
          playsinline: 1,      
          disablekb: 1,        
          iv_load_policy: 3,   
          fs: 0,               
          cc_load_policy: 0,   
          color: 'white',     
        },
        events: {
          onReady: (e) => {
            if (cancelled) return
            setPlayer(e.target)
            setDuration(e.target.getDuration?.() || 0)
            setIsMuted(e.target.isMuted?.() || false)
          },
          onStateChange: (e) => {
            const YT = window.YT.PlayerState
            switch (e.data) {
              case YT.PLAYING:   setStatus('playing'); break
              case YT.PAUSED:    setStatus('paused'); break
              case YT.BUFFERING: setStatus('buffering'); break
              case YT.ENDED:     setStatus('ended'); break
              default: break
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        createPlayer()
      }
    }

    return () => { cancelled = true }
  }, [trailerKey])

  useEffect(() => {
    if (!player) return
    const interval = setInterval(() => {
      if (isDragging) return
      setCurrent(player.getCurrentTime?.() || 0)
      const d = player.getDuration?.() || 0
      if (d && d !== duration) setDuration(d)
    }, 250)
    return () => clearInterval(interval)
  }, [player, isDragging, duration])

  useEffect(() => {
    if (!showControls || !isPlaying) return
    const timer = setTimeout(() => setShowControls(false), 2800)
    return () => clearTimeout(timer)
  }, [showControls, isPlaying, current])

  const togglePlay = useCallback(() => {
    if (!player) return
    if (status === 'ended') { player.seekTo(0, true); player.playVideo(); return }
    isPlaying ? player.pauseVideo() : player.playVideo()
    setShowControls(true)
  }, [player, status, isPlaying])

  const toggleMute = () => {
    if (!player) return
    if (isMuted) { player.unMute(); setIsMuted(false) }
    else { player.mute(); setIsMuted(true) }
  }

  const skip = (seconds) => {
    if (!player) return
    const t = Math.max(0, Math.min(duration, player.getCurrentTime() + seconds))
    player.seekTo(t, true)
    setCurrent(t)
    setSkipIndicator(seconds > 0 ? 'right' : 'left')
    setTimeout(() => setSkipIndicator(null), 500)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.()
  }

  const seekFromEvent = useCallback((clientX) => {
    if (!player || !barRef.current || !duration) return
    const rect = barRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const t = ratio * duration
    setCurrent(t)
    player.seekTo(t, true)
  }, [player, duration])

  useEffect(() => {
    if (!isDragging) return
    const move = (e) => seekFromEvent(e.touches?.[0]?.clientX ?? e.clientX)
    const up = () => setIsDragging(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [isDragging, seekFromEvent])

  const lastTap = useRef(0)
  const handleTap = (e) => {
    const now = e.timeStamp
    const isDoubleTap = now - lastTap.current < 300
    lastTap.current = now

    if (isDoubleTap) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX || e.changedTouches?.[0]?.clientX || 0) - rect.left
      skip(x < rect.width / 2 ? -10 : 10)
    } else {
      setShowControls((s) => (isPlaying ? !s : true))
    }
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className='relative w-full aspect-video rounded-2xl overflow-hidden bg-black select-none'
      onClick={handleTap}
    >
      <div ref={playerRef} className='w-full h-full pointer-events-none' />

      <div
        className={`absolute inset-0 bg-black transition-opacity pointer-events-none ${
          showCover ? 'opacity-100 duration-0' : 'opacity-0 duration-200'
        }`}
      >
        {poster && (
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}
        <div className='absolute inset-0 bg-black/50' />

        {status === 'buffering' && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-12 h-12 rounded-full border-[3px] border-white/25 border-t-primary animate-spin' />
          </div>
        )}
      </div>

      {skipIndicator && (
        <div className={`absolute top-1/2 -translate-y-1/2 ${
          skipIndicator === 'left' ? 'left-8' : 'right-8'
        } flex flex-col items-center text-white pointer-events-none`}>
          <div className='w-14 h-14 rounded-full bg-black/60 flex items-center justify-center'>
            <span className='text-base font-bold'>
              {skipIndicator === 'left' ? '−10' : '+10'}
            </span>
          </div>
        </div>
      )}

      <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none' />

        <div className='absolute inset-0 flex items-center justify-center'>
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay() }}
            className='w-11 h-11 flex items-center justify-center rounded-full bg-primary/90 hover:bg-primary hover:scale-110 transition-all cursor-pointer shadow-lg ring-2 ring-black/40'
          >
            {status === 'ended' ? (
              <svg className='w-5 h-5 text-black' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
              </svg>
            ) : isPlaying ? (
              <svg className='w-5 h-5 text-black' viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg className='w-5 h-5 text-black ml-0.5' viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        <div className='absolute bottom-0 inset-x-0 px-3 pb-1.5 flex flex-col'>
          <div
            ref={barRef}
            onClick={(e) => { e.stopPropagation(); seekFromEvent(e.clientX) }}
            onMouseDown={(e) => { e.stopPropagation(); setIsDragging(true); seekFromEvent(e.clientX) }}
            onTouchStart={(e) => { e.stopPropagation(); setIsDragging(true); seekFromEvent(e.touches[0].clientX) }}
            className='group relative w-full py-1.5 cursor-pointer'
          >
            <div className='w-full h-1 bg-white/25 rounded-full overflow-hidden'>
              <div className='h-full bg-primary rounded-full' style={{ width: `${progress}%` }} />
            </div>
            <div
              className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow opacity-0 group-hover:opacity-100 transition-opacity'
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className='flex items-center justify-between text-white'>
            <span className='text-[11px] font-medium tabular-nums text-white/80 leading-none'>
              {fmt(current)} / {fmt(duration)}
            </span>

            <div className='flex items-center gap-2.5'>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute() }}
                className='w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer'
              >
                {isMuted ? (
                  <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6" />
                  </svg>
                ) : (
                  <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
                  </svg>
                )}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen() }}
                className='w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer'
              >
                <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrailerPlayer
