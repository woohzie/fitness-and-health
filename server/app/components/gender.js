import Image from 'next/image';

export default function GenderSelect({gender = 'Male', onClick, selected = false}) {
    return (
        <div className={`w-35 flex justify-center items-center cursor-pointer gap-1 rounded-lg px-5 py-1 transition-colors ease-in-out duration-300 ${selected ? 'text-white bg-[linear-gradient(to_right,_#EB2CFC,_#62CCFA)] hover:bg-[linear-gradient(to_right,_#D10FE8,_#4FB8E8)]' : 'text-gray-700 border bg-[#FBFBFB] border-[#DBDBDB] hover:bg-[#F0F0F0]'}`} onClick={onClick}>
            <Image
                src={gender === 'Male' ? '/images/male.png':'/images/female.png'}
                width={30}
                height={10}
                alt={gender}
            />
            <span className="font-medium">{gender}</span>
        </div>
    )
}