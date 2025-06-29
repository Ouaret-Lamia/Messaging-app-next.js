import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loading: FC = ({}) => {
  return (
    // <div className='w-full flex flex-col gap-3'>
    //   <Skeleton className='mb-4' height={60} width={500} />
    //   <Skeleton height={20} width={150} />
    //   <Skeleton height={50} width={400} />
    // </div>

    <main className="w-full">
      <Skeleton className="w-full h-[45vh]" />
      <Skeleton className="w-full h-[30vh]" />
    </main>
  );
};

export default loading;
