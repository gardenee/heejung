type VoteActionButtonProps = {
  labelText: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export const VoteActionButton = ({
  labelText,
  icon,
}: VoteActionButtonProps) => {
  return (
    <button className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-white/50 bg-black/10 py-3 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-transparent hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'>
      {icon}
      <span className='font-semibold'>{labelText}</span>
    </button>
  );
};
