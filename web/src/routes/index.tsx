import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: RouteComponent,
    loader: () => ({
        crumb: 'Home'
    })
});

function RouteComponent() {
    return (
        <div>
        Hello "/"!
            <img src="https://static.wikia.nocookie.net/finalfantasy/images/9/94/Tifa-FFVIIArt.png" />
        </div>);
}
