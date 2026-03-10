import { BUILD_INFO } from '@/build-info';

export const BuildInfoLabel = () => {
  return (
    <span className="text-xs text-super-ultra-dark-grey">
      Built at: {BUILD_INFO.builtAt} (commit {BUILD_INFO.commitHash})
    </span>
  );
};
