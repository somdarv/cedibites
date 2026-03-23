import { ModalProvider } from '../components/providers/ModalProvider';
import { AuthProvider } from '../components/providers/AuthProvider';
import { MenuDiscoveryProvider } from '../components/providers/MenuDiscoveryProvider';
import { CartProvider } from '../components/providers/CartProvider';
import LocationRequestModal from '../components/ui/LocationRequestModal';
import BranchSelectorModal from '../components/ui/BranchSelectorModal';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <ModalProvider>
            <AuthProvider>
                <MenuDiscoveryProvider>
                    <CartProvider>
                        <LocationRequestModal />
                        <BranchSelectorModal />
                        {children}
                    </CartProvider>
                </MenuDiscoveryProvider>
            </AuthProvider>
        </ModalProvider>
    );
}
