import { memo, useCallback } from 'react';
import { VotingChip } from './voting-chip';

export type Party = {
  id: number;
  name: string;
  color: string;
};

const PARTIES: Array<Party> = [
  { id: 1, name: '더불어민주당', color: '#152484' },
  { id: 2, name: '국민의힘', color: '#e61e2b' },
  { id: 3, name: '조국혁신당', color: '#0073cf' },
  { id: 4, name: '개혁신당', color: '#ff7210' },
  { id: 5, name: '진보당', color: '#d6001c' },
  { id: 6, name: '기본소득당', color: '#00d2c3' },
  { id: 7, name: '사회민주당', color: '#f58400' },
  { id: 8, name: '무소속', color: '#808080' },
];

const VotingChipsComponent = () => {
  const handleChipClick = useCallback(() => {
    // TODO: partyId 파라미터로 받아서 투표 api 연결
  }, []);

  return (
    <div className='flex w-2/3 flex-col justify-center gap-4 self-center'>
      <h2 className='text-center text-lg font-bold text-gray-800'>
        응원하는 정당을 선택해주세요
      </h2>

      <div className='mx-auto grid w-fit grid-cols-4 gap-x-4 gap-y-3'>
        {PARTIES.map(party => {
          return (
            <VotingChip key={party.id} {...party} onClick={handleChipClick} />
          );
        })}
      </div>
    </div>
  );
};

export const VotingSection = memo(VotingChipsComponent);
