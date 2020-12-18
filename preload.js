// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const { desktopCapturer, remote } = require('electron');
  const { Menu } = remote;

  const videoSelectBtn = document.getElementById('videoSelectBtn');
  videoSelectBtn.onclick = getVideoSources;

  async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
      types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
      inputSources.map(source => {
        return {
          label: source.name,
          click: () => selectSource(source)
        };
      })
    );

    videoOptionsMenu.popup();
  }
})
