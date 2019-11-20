import React, { useRef, useEffect } from 'react';
import { useThree, useRender } from 'react-three-fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      effectComposer: any;
      renderPass: any;
      sSAOPass: any;
      sAOPass: any;
    }
  }
}

export const Effects = React.memo(() => {
  const { gl, scene, camera, size } = useThree();

  const composerRef = useRef<EffectComposer>();

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) {
      return;
    }

    composer.setSize(size.width, size.height);
  }, [size.width, size.height, scene, camera]);

  // This takes over as the main render-loop (when 2nd arg is set to true)
  useRender(() => composerRef.current!.render(), true);

  // <sSAOPass
  //       attachArray="passes"
  //       args={[scene, camera, size.width, size.height]}
  //       kernelRadius={50}
  //       minDistance={0.0001}
  //       maxDistance={0.001}
  //       width={size.width}
  //       height={size.height}
  //     />

  return (
    <effectComposer ref={composerRef} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />
      <sAOPass
        attachArray="passes"
        args={[scene, camera, false, true]}
        params-saoScale={300}
        params-saoBias={0.0}
        params-saoBlurRadius={4}
        params-saoIntensity={0.1}
        params-saoKernelRadius={10}
      />
    </effectComposer>
  );
});
