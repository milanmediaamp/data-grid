import { Button } from '@progress/kendo-react-buttons'
import { Input } from '@progress/kendo-react-inputs'
import { useState } from 'react'
// import React from 'react'

const Xlsave = ({exportExport}) => {//eslint-disable-line
  const [exportName, setExportName] = useState(null)
  return (
    <div>
      <Input
                value={exportName}
                onChange={(e) => setExportName(e.value)}
                placeholder="Enter File Name"
              />
              <Button
                title="Export Excel"
                themeColor={"primary"}
                type="button"
                onClick={() => exportExport(exportName)}
              >
                Export to Excel
      </Button>
    </div>
  )
}

export default Xlsave