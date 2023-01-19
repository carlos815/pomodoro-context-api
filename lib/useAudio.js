import { useEffect, useState } from "react";

const useAudio = (url) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(new Audio(url))
  }, [])

  const stopAudio = () => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  const playAudio = () => {
    audio.volume = 0.3
    audio.play();
    audio.addEventListener(
      'ended',
      function () {
        this.currentTime = 0
        this.play()
          .then(() => {
          })
          .catch((e) => {
          })
      },
      false,
    );
  }

  return { audio, playAudio, stopAudio };
};

export default useAudio