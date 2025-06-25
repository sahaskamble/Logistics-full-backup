import { Check, ArrowDown ,ArrowRight,Mail,CircleHelp  } from 'lucide-react';

export default function RegistrationSuccessful() {
    return (
        <div className="bg-[#F9FAFB] h-screen flex justify-center items-center p-50  ">
            <div className="bg-white flex justify-center rounded-xl h-100 w-200">
                <div className="w-1/2 bg-[linear-gradient(to_right,#1B6838,#3B7D54)] text-white flex flex-col items-center justify-center gap-6 rounded-l-xl py-12">
                    <div className="bg-white rounded-full p-6 shadow-md">
                        <Check size={60} className="text-[#166534]" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-2">Welcome Aboard!</h1>
                        <p className="text-sm text-white/90">Your journey begins now</p>
                    </div>
                </div>


                <div className="bg-white w-1/2 p-3 flex flex-col justify-center text-center">

                    <h1 className="text-2xl font-semibold text-black mb-7">🎉 Registration Successful!</h1>
                    <h1 className="text-[#374151] text-xl mb-5">Thank you for registering.</h1>
                    <h1 className="text-[#374151]">You'll be notified soon with further instructions and updates.</h1>
                    <h1 className="flex mt-12 justify-center gap-2 text-[#6B7280]"><ArrowDown/> Continue to your dashboard</h1>
                    <button className="bg-[#35794F] p-3 text-white flex justify-center mt-4 rounded-md" >Go To Dashboard<ArrowRight/></button>
                    <div className="flex gap-3 justify-center mt-10">
                        <p className="text-[#6B7280] text-sm flex"><Mail size={20} className="text-[#166534] mr-1"/>Email confirmation sent</p>
                        <p className="text-[#6B7280] text-sm flex"><CircleHelp size={20} className="text-[#166534] mr-1"/>Account secured</p>
                    </div>
                </div>
            </div>


        </div>
    );
}