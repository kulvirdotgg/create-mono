import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'
import '@/globals.css'

const el = document.getElementById('root')
if (el) {
    const root = createRoot(el)
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    )
} else {
    throw new Error('Could not find root element')
}
