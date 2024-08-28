function getPkgManger() {
    const ua = process.env.npm_config_user_agent

    if (ua) {
        if (ua.startsWith('npm')) return 'npm'
        else if (ua.startsWith('bun')) return 'bun'
        else if (ua.startsWith('yarn')) return 'yarn'
        else if (ua.startsWith('pnpm')) return 'pnpm'
    }
    return 'npm'
}
export { getPkgManger }
