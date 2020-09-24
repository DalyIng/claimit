import status from './status';
import latestBlocksInfos from './latestBlocksInfos';

const rehydrated = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

export default {
  rehydrated,
  status,
  latestBlocksInfos,
};
