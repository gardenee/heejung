import { memo, useCallback, useMemo, useState } from 'react';
import type { Party } from './voting-section';
import { CheckIcon } from 'lucide-react';

type VotingChipsProps = Party & {
  onClick?: (partyId: number) => void;
};

const VotingChipComponent = ({
  id: partyId,
  name: partyName,
  onClick,
}: VotingChipsProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const buttonStyle = useMemo(() => {
    return `
      relative flex w-36 h-12 justify-center items-center pl-4
      rounded-lg cursor-pointer overflow-hidden 
      transition-all duration-300 ease-out
      bg-white shadow-md hover:shadow-lg
      transform hover:-translate-y-1
      ${isHovered ? 'text-white' : 'text-gray-800'}
    `;
  }, [isHovered]);

  const handlePartySelect = useCallback(() => {
    onClick?.(partyId);
  }, [partyId, onClick]);

  return (
    <button
      key={partyId}
      onClick={handlePartySelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={buttonStyle}
    >
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out bg-party-${partyId}-main `}
        style={{
          transform: isHovered ? 'translateX(0%)' : 'translateX(-100%)',
        }}
      />

      <div className='relative z-10 flex items-center gap-2'>
        {isHovered ? (
          <CheckIcon className='h-4 w-4 text-white drop-shadow-sm' />
        ) : (
          <div
            className={`h-4 w-4 rounded-full bg-party-${partyId}-main shadow-sm`}
          />
        )}
        <span className='text-basic w-24 text-left font-semibold tracking-tight'>
          {partyName}
        </span>
      </div>
    </button>
  );
};

export const VotingChip = memo(VotingChipComponent);
