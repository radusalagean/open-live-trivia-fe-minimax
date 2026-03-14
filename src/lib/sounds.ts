const sounds = {
  won: new Audio('/sounds/won.ogg'),
  lost: new Audio('/sounds/lost.ogg'),
  attempt: new Audio('/sounds/attempt.ogg'),
  split: new Audio('/sounds/split.ogg'),
};

export const playSound = (soundName: keyof typeof sounds) => {
  sounds[soundName].currentTime = 0;
  sounds[soundName].play().catch(() => {});
};

export const stopSound = (soundName: keyof typeof sounds) => {
  sounds[soundName].pause();
  sounds[soundName].currentTime = 0;
};

export const stopAllSounds = () => {
  Object.keys(sounds).forEach((key) => {
    const sound = sounds[key as keyof typeof sounds];
    sound.pause();
    sound.currentTime = 0;
  });
};