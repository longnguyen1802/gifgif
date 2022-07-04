import React from 'react';
import Button from './Button';
import ExportModal from './ExportModal';
import ExportError from './ExportError';

import gifshot from 'gifshot';

class Export extends React.Component {
	constructor(props) {
		super(props);
		this.generate = this.generate.bind(this);
		this.closeExport = this.closeExport.bind(this);

		this.state = { showExport: false, generating: false };
	}

	closeExport() {
		this.setState({
			showExport: false,
		});
	}

	generate() {
		this.setState({
			generating: true,
		});

		// get the URLs from the images array
		const images = this.props.images.map((e) => {
			return e[0];
		});

		// https://github.com/yahoo/gifshot#options
		const props = {
			gifWidth: this.props.width,
			gifHeight: this.props.height,
			images: images,
			numWorkers: 3,
			interval: this.props.duration,
			sampleInterval: 1,
			numFrames: 1,
		};

		if (gifshot.isExistingImagesGIFSupported()) {
			console.log('Browser supports all the gifshot options');
			console.log('Start process...');

			gifshot.createGIF(props, (obj) => {
				if (!obj.error) {
					console.log('No error');
					this.setState({ showExport: true, image: obj.image, generating: false });
				} else if (this.props.images.length === 0) {
					console.log('No images selected');
					this.setState({ errorNoImages: true });
				} else if (gifshot.isSupported()) {
					console.log('is');
				} else {
					console.log('Error');
				}
			});
		} else {
			console.log('Browser does NOT support all the gifshot options');
			this.setState({ errorNoSupport: true });
		}
	}

	render() {
		return (
			<>
				<Button btnClick={this.generate} color="#C4CFBE">
					{this.state.generating ? '🦾 Generating...' : '🎬 Generate GIF'}
				</Button>
				{this.state.showExport ? (
					<ExportModal btnClick={this.closeExport} image={this.state.image}></ExportModal>
				) : (
					''
				)}
				{this.state.errorNoImages ? <ExportError error="❌ No images selected in step 1" /> : ''}
				{this.state.errorNoSupport ? <ExportError error="❌ Your browser is not supported" /> : ''}
			</>
		);
	}
}

export default Export;
