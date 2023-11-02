"use client";

export default function Page() {
    return (
        <main className="w-full h-full flex flex-col">
            <h1 className="font-bold text-xl">Notificações</h1>
            <div className="w-full h-full flex flex-row justify-between items-center">
                <div className="h-full m-4 drop-shadow-lg bg-neutral-50 rounded-md w-96">
                    <h1>Menu</h1>
                </div>
                <div className="w-full h-full m-4 drop-shadow-lg bg-neutral-50 rounded-md">
                    <h1>Item</h1>
                </div>
            </div>
        </main>
    );
}

