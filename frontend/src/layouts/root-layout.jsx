import { Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react'

import { Layout } from 'antd'

const { Header, Content, Footer } = Layout

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

export default function RootLayout() {
    const navigate = useNavigate();

    return (
        <ClerkProvider navigate={navigate} publishableKey={PUBLISHABLE_KEY}>
            <Layout>
                <Header className="header">
                    <div style={{ color: "white" }}>La Bataille</div>
                    <SignedIn >
                        <UserButton afterSignOutUrl='/' />
                    </SignedIn>
                    <SignedOut >
                        <SignInButton mode='modal' className="sign-in-button">
                            Se connecter
                        </SignInButton>
                    </SignedOut>
                </Header>
                <Content style={{ padding: '20px 50px', width: '500px' }}>
                    <main>
                        <Outlet />
                    </main>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Bataille - React AntD Socket.IO</Footer>
            </Layout>
        </ClerkProvider>
    )
}