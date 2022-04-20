// @ts-nocheck
import Navbar from '../components/Navbar';

// For styling purposes of the drop down and modals

export default function Example() {
	return (
		<>
			<div className="h-screen relative">
				<div className="absolute top-0 w-full z-10">
					<Navbar />
				</div>
				<div className="flex flex-row justify-center align-middle mr-[320px] h-full">
					<div className="h-full w-full flex justify-center">
						<img
							src="https://cdna.artstation.com/p/assets/images/images/017/674/056/medium/artyom-turskyi-777-8.jpg?1556901383"
							alt=""
							className="self-center"
						/>
					</div>

					<div className="fixed bg-white h-full w-[320px] overflow-y-auto right-0 p-5 pt-[76px]">
						<p>sadadawe</p>
						<p>sadadawe</p>
					</div>
				</div>
			</div>
		</>
	);
}
