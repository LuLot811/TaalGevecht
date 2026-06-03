/**
 * Geluidseffecten
 */

const Sounds = (() => {
  const BELL_SRC = "sounds/boxing-bell-round-end.mp3";
  let bellAudio = null;

  function getBellAudio() {
    if (!bellAudio) {
      bellAudio = new Audio(BELL_SRC);
      bellAudio.preload = "auto";
    }
    return bellAudio;
  }

  async function playBoxingBell() {
    try {
      const audio = getBellAudio();
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
    } catch (_) {
      // Gebruiker heeft nog niet met de pagina geïnteracteerd, of geluid geblokkeerd
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => getBellAudio().load());
  } else {
    getBellAudio().load();
  }

  return { playBoxingBell };
})();
