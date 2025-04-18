import React from 'react'
import DropdownComponent from './components/DropdownComponent'

function page() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <DropdownComponent room={"Kitchen"} />
    </div>
  )
}

export default page
