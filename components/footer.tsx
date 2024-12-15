export default function Footer() {
    return (
        <footer className="flex justify-center pb-10 pt-8">
            <span className="text-muted text-sm text-center">&copy; DragonFruit Network {new Date().getUTCFullYear()}</span>
        </footer>
    )
}