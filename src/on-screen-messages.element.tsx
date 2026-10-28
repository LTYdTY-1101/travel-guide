// Adapted from Remotion Elements: packages/docs/elements/storytelling/on-screen-messages.
import type React from 'react';
import {Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';

type Props = {readonly incomingText: string; readonly outgoingText: string; readonly style?: React.CSSProperties};

// Shared reveal motion for the original message bubbles and the opening notification card.
export const onScreenMessageEntrance = (frame: number, start: number, end: number): React.CSSProperties => ({
	opacity: interpolate(frame, [start, end], [0, 1], {
		easing: Easing.bezier(0.16, 1, 0.3, 1),
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	}),
	translate: interpolate(frame, [start, end], ['0px 32px', '0px 0px'], {
		easing: Easing.bezier(0.16, 1, 0.3, 1),
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	}),
});

const OnScreenMessagesInner: React.FC<Props> = ({incomingText, outgoingText, style}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame() * 30 / fps;

	return (
		<>
			<style>{`
				.on-screen-message-from-them::after,
				.on-screen-message-from-me::after {
					bottom: 0;
					content: '';
					height: 32px;
					position: absolute;
					width: 32px;
				}

				.on-screen-message-from-them::after {
					background-color: #e5e5ea;
					clip-path: path('M32 0H12v16c0 8-4 13-12 16 18 0 32-7 32-16Z');
					left: -12px;
				}

				.on-screen-message-from-me::after {
					background-color: #248bf5;
					clip-path: path('M0 0h20v16c0 8 4 13 12 16C14 32 0 25 0 16Z');
					right: -12px;
				}
			`}</style>
			<Interactive.Div
				name="Container"
				style={{
					boxSizing: 'border-box',
					color: '#f8fafc',
					display: 'flex',
					flexDirection: 'column',
					fontFamily: 'PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif',
					gap: 32,
					height: 420,
					isolation: 'isolate',
					paddingTop: 90,
					position: 'relative',
					width: 896,
					...style,
				}}
			>
				<Interactive.Div
					className="on-screen-message-from-them"
					name="Message 1"
					style={{
						alignSelf: 'flex-start',
						backgroundColor: '#e5e5ea',
						borderRadius: 37,
						boxSizing: 'border-box',
						color: '#000000',
						fontSize: 54,
						fontWeight: 600,
						lineHeight: 1.25,
						marginLeft: 70,
						maxWidth: '75%',
						opacity: interpolate(frame, [2, 10], [0, 1], {
							easing: Easing.bezier(0.16, 1, 0.3, 1),
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
						padding: '16px 28px',
						position: 'relative',
						translate: interpolate(frame, [2, 10], ['0px 32px', '0px 0px'], {
							easing: Easing.bezier(0.16, 1, 0.3, 1),
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
						width: 'fit-content',
						willChange: 'opacity, transform',
						wordWrap: 'break-word',
						display: 'flex',
						alignItems: 'center',
						gap: 18,
					}}
				>
					<Interactive.Div name="苹果短信图标" style={{width: 58, height: 58, borderRadius: 14, flex: '0 0 auto', background: 'linear-gradient(180deg,#60ec6b,#12c83d)', display: 'grid', placeItems: 'center'}}>
						<div style={{width: 35, height: 28, borderRadius: '50%', background: '#fff', position: 'relative'}}><div style={{position: 'absolute', width: 11, height: 11, background: '#fff', bottom: -3, left: 2, rotate: '28deg'}} /></div>
					</Interactive.Div>
					{incomingText}
				</Interactive.Div>
				<Interactive.Div
					className="on-screen-message-from-me"
					name="Message 2"
					style={{
						alignSelf: 'flex-end',
						backgroundColor: '#248bf5',
						borderRadius: 37,
						boxSizing: 'border-box',
						color: '#ffffff',
						fontSize: 54,
						fontWeight: 600,
						lineHeight: 1.25,
						marginRight: 70,
						maxWidth: '75%',
						opacity: interpolate(frame, [37, 45], [0, 1], {
							easing: Easing.bezier(0.16, 1, 0.3, 1),
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
						padding: '16px 28px',
						position: 'relative',
						translate: interpolate(frame, [37, 45], ['0px 32px', '0px 0px'], {
							easing: Easing.bezier(0.16, 1, 0.3, 1),
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
						width: 'fit-content',
						willChange: 'opacity, transform',
						wordWrap: 'break-word',
					}}
				>
					{outgoingText}
				</Interactive.Div>
			</Interactive.Div>
		</>
	);
};


const schema = {incomingText: {type: 'text-content', default: '国庆，欧洲？', description: '收到的消息'}, outgoingText: {type: 'text-content', default: '出发吧', description: '回复消息'}} as const satisfies InteractivitySchema;
export const OnScreenMessages = Interactive.withSchema({Component: OnScreenMessagesInner, componentName: '<OnScreenMessages>', schema, wrapInSequence: true});
