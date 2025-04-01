import {path} from 'ramda';

const duration = {duration: 0.5};

const fadeIn = {
  initial: {opacity: 0},
  animate: {opacity: 1, transition: {...duration}},
  exit: {opacity: 0},
};

const topDown = {
  initial: {opacity: 0, y: -100},
  animate: {opacity: 1, y: 0, transition: {...duration}},
  exit: {opacity: 0, y: -100},
};

const scaleIn = {
  initial: {opacity: 0, scale: 0.8, transition: {duration: 0.3}},
  animate: {opacity: 1, scale: 1, transition: {duration: 0.5}},
  exit: {opacity: 0, scale: 0.8, transition: {duration: 0.3}}
};

const slideDown = {
  initial: {height: 0, opacity: 0, transition: {duration: 0.3}},
  animate: {height: 'auto', opacity: 1},
  exit: {height: 0, opacity: 0, transition: {duration: 0.3}},
};

const stagger = {
  initial: {opacity: 1},
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  },
};

const getMotion = (variants, option) => {
  const getVariants = names => path(names, variants);
  const getOption = names => path(names, option);
  const getStateMotion = name => {
    return {
      ...getVariants([name]), 
      ...getOption([name]), 
      transition: {
        ...getVariants([name, 'transition']), 
        ...getOption([name, 'transition']), 
      }
    };
  };

  return {
    initial: getStateMotion('initial'),
    animate: getStateMotion('animate'),
    exit: getStateMotion('exit')
  };
}; 

export const getFadeInMotion = option => getMotion(fadeIn, option);
export const getTopDownMotion = option => getMotion(topDown, option);
export const getScaleInMotion = option => getMotion(scaleIn, option);
export const getSlideDownMotion = option => getMotion(slideDown, option);
export const getStaggerMotion = option => getMotion(stagger, option);