import {
  RotateCcwIcon,
  BarChart3Icon,
  CheckCircleIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { VoteActionButton } from './vote-action-button';

interface VotedSectionProps {
  backgroundColor?: string;
}

export const VotedSection = ({
  backgroundColor = 'bg-blue-600',
}: VotedSectionProps) => {
  // 예시 정당 데이터 (더불어민주당)
  const selectedParty = {
    name: '더불어민주당',
    englishName: 'Democratic Party of Korea',
    slogan: '국민과 함께하는 변화',
    currentVotes: 2847,
    percentage: 42.3,
    rank: 1,
    trend: '+5.2%',
  };

  const handleClickVoteAgain = () => {
    console.log('다시 투표하기');
  };

  return (
    <div
      className={`relative w-2/3 self-center overflow-hidden rounded-2xl ${backgroundColor} p-6 text-white shadow-xl`}
    >
      {/* 배경 패턴 */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/20' />
        <div className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10' />
        <div className='absolute top-20 right-12 h-16 w-16 rounded-full bg-white/5' />
      </div>

      <div className='relative z-10'>
        {/* 헤더 - 선택 완료 표시 */}
        <div className='mb-6 flex items-center gap-3'>
          <CheckCircleIcon className='h-6 w-6 text-green-300' />
          <span className='text-lg font-semibold text-green-300'>
            나의 선택
          </span>
        </div>

        {/* 정당 정보 */}
        <div className='mb-6'>
          <div className='mb-2 flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold'>
              민
            </div>
            <div>
              <h2 className='text-2xl font-bold'>{selectedParty.name}</h2>
              <p className='text-blue-100'>{selectedParty.englishName}</p>
            </div>
          </div>
          <p className='text-lg text-blue-50 italic'>
            "{selectedParty.slogan}"
          </p>
        </div>

        {/* 투표 현황 */}
        <div className='mb-6 rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
          <h3 className='mb-3 text-lg font-semibold'>실시간 투표 현황</h3>
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{selectedParty.rank}위</p>
              <p className='text-sm text-blue-100'>현재 순위</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{selectedParty.percentage}%</p>
              <p className='text-sm text-blue-100'>득표율</p>
            </div>
            <div className='text-center'>
              <div className='flex items-center justify-center gap-1'>
                <TrendingUpIcon className='h-4 w-4 text-green-300' />
                <p className='text-xl font-bold text-green-300'>
                  {selectedParty.trend}
                </p>
              </div>
              <p className='text-sm text-blue-100'>증감률</p>
            </div>
          </div>
          <div className='mt-3'>
            <div className='flex justify-between text-sm text-blue-100'>
              <span>총 {selectedParty.currentVotes.toLocaleString()}표</span>
              <span>참여자 대비 {selectedParty.percentage}%</span>
            </div>
            <div className='mt-2 h-2 rounded-full bg-white/20'>
              <div
                className='h-full rounded-full bg-white/60'
                style={{ width: `${selectedParty.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className='flex gap-3'>
          <VoteActionButton
            labelText='다시 투표하기'
            icon={<RotateCcwIcon className='h-5 w-5' />}
            onClick={() => {}}
          />
          <VoteActionButton
            labelText='상세 통계'
            icon={<BarChart3Icon className='h-5 w-5' />}
            onClick={() => {}}
          />
        </div>

        {/* 추가 정보 */}
        <div className='mt-4 text-center'>
          <p className='text-sm text-blue-100'>
            투표는 언제든 변경할 수 있습니다 • 실시간으로 업데이트됩니다
          </p>
        </div>
      </div>
    </div>
  );
};
