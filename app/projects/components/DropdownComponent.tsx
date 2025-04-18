import React from 'react'

function DropdownComponent({room} : {room : string}) {
  return (
    <details className='w-full bg-primary-neon-tint-500 group open:rounded-tl-xl open:rounded-tr-xl rounded-xl'>
        <summary className='flex justify-between items-center cursor-pointer p-4'>
            <div className="font-bold text-xl">{room}</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 transition-transform duration-300 group-open:rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </summary>
      <div className="bg-secondary-dark">Hello</div>
    </details>
  )
}

export default DropdownComponent
