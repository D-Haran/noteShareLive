import { createContext, useEffect, useState } from 'react';

const FilePathContext = createContext({filePath: ''})

export const FilePathContextProvider = ({ children }) => {

    const [filePath, setFilePath] = useState('')

    const spliceFilePath = (path) => {
        const splicedPath = path.split("/backend")[1]
        setFilePath(splicedPath)
    }

    const context = {filePath, spliceFilePath}

    return (
        <FilePathContext.Provider value={context}>
            { children }
        </FilePathContext.Provider>
    )
}

export default FilePathContext