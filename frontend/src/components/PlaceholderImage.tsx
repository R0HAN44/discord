import { getInitials, stringToColor } from "@/lib/utils";

const PlaceholderImage = ({ name }: { name: string }) => {
  return (
    <button className="group flex items-center">
      <div
        className="flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700"
        style={{ backgroundColor: stringToColor(name) }}
      >
        <span className="group-hover:text-white text-white text-[18px] font-bold transition">
          {getInitials(name)}
        </span>
      </div>
    </button>
  );
};

export default PlaceholderImage;
