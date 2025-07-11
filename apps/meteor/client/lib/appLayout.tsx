import { Emitter } from '@rocket.chat/emitter';
import type { ReactElement } from 'react';
import { lazy } from 'react';

const ConnectionStatusBar = lazy(() => import('../components/connectionStatus/ConnectionStatusBar'));
const BannerRegion = lazy(() => import('../views/banners/BannerRegion'));
const ModalRegion = lazy(() => import('@rocket.chat/ui-client').then(({ ModalRegion }) => ({ default: ModalRegion })));
const ActionManagerBusyState = lazy(() => import('../components/ActionManagerBusyState'));
const AppLayoutThemeWrapper = lazy(() => import('../components/AppLayoutThemeWrapper'));
const CloudAnnouncementsRegion = lazy(() => import('../views/cloud/CloudAnnouncementsRegion'));

type AppLayoutDescriptor = ReactElement | null;

class AppLayoutSubscription extends Emitter<{ update: void }> {
	private descriptor: AppLayoutDescriptor = null;

	getSnapshot = (): AppLayoutDescriptor => this.descriptor;

	subscribe = (onStoreChange: () => void): (() => void) => this.on('update', onStoreChange);

	setCurrentValue(descriptor: AppLayoutDescriptor): void {
		this.descriptor = descriptor;
		this.emit('update');
	}

	render(element: ReactElement): void {
		this.setCurrentValue(element);
	}

	wrap(element: ReactElement): ReactElement {
		return (
			<AppLayoutThemeWrapper>
				<ConnectionStatusBar />
				<ActionManagerBusyState />
				<CloudAnnouncementsRegion />
				<BannerRegion />
				{element}
				<ModalRegion />
			</AppLayoutThemeWrapper>
		);
	}
}

export const appLayout = new AppLayoutSubscription();
