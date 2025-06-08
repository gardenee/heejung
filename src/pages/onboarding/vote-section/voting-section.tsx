import { memo, useCallback } from 'react';
import { useMetadata } from '@/contexts/metadata-context/metadata-context';
import { VotingChip } from './voting-chip';

const VotingChipsComponent = () => {
  const { parties } = useMetadata();
  const handleChipClick = useCallback((partyId: number) => {
    // TODO: 투표 api 연결
  }, []);

  return (
    <div className='flex w-2/3 flex-col justify-center gap-4 self-center'>
      <h2 className='text-center text-lg font-bold text-gray-800'>
        응원하는 정당을 선택해주세요
      </h2>

      <div className='mx-auto grid w-fit grid-cols-4 gap-x-4 gap-y-3'>
        {parties?.map(party => {
          return (
            <VotingChip key={party.id} {...party} onClick={handleChipClick} />
          );
        })}
      </div>
    </div>
  );
};

export const VotingSection = memo(VotingChipsComponent);
