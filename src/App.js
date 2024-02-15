import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  // const { unityProvider } = useUnityContext({
  //   loaderUrl: "unity-local/build/ball-sim.loader.js",
  //   dataUrl: "unity-local/build/ball-sim.data",
  //   frameworkUrl: "unity-local/build/ball-sim.framework.js",
  //   codeUrl: "unity-local/build/ball-sim.wasm",
  // });
  
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/ball-sim.loader.js",
    dataUrl: "build/ball-sim.data",
    frameworkUrl: "build/ball-sim.framework.js",
    codeUrl: "build/ball-sim.wasm",
  });
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>react / unity</h1>
        <Unity unityProvider={unityProvider} style={{ width: "1688px", height: "780px" }}/>
      </header>
    </div>
  );
}

export default App;
