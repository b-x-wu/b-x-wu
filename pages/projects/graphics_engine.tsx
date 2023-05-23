import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function GraphicsEngine (): JSX.Element {
  const [WASM, setWASM] = useState<any>(null)

  useEffect(() => {
    if (typeof (window as any).GRAPHICS_ENGINE === 'function' && WASM === null) {
      (window as any).GRAPHICS_ENGINE()
        .then((wasm: any) => {
          setWASM(wasm)
        })
    }
  }, [])

  if (WASM != null) {
    console.log('creating rgb scene')
    const RGBScene: any = new WASM.RGBScene()
    RGBScene.render()
    console.log(RGBScene.getBitmap())
  }

  return (
    <>
        <Script src='/wasm/graphics_engine.js' strategy='beforeInteractive' onReady={() => { console.log('ready') }}/>
    </>
  )
}
