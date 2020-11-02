import React, { Component } from 'react';
import { AppExtensionSDK, AppState } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Form,
  Workbench,
  TextField,
  Paragraph,
  Card,
  SelectField,
  Option,
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import validateUrl from '../utils/validateUrl';

const bannerStyles = css`
  height: 300px;
  background: #ccc;
  pointer-events: none;
`;

export enum AssetSelectorMode {
  single = 'single',
  multiple = 'multiple',
}

export interface AppInstallationParameters {
  configUrl: string;
  mode: AssetSelectorMode;
}

export interface ConfigProps {
  sdk: AppExtensionSDK;
}

export interface ConfigState {
  parameters: AppInstallationParameters;
  validConfigUrl: boolean;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      parameters: {
        configUrl: '',
        mode: AssetSelectorMode.single,
      },
      validConfigUrl: true,
    };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount(): Promise<void> {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const { sdk } = this.props;
    const parameters: AppInstallationParameters | null = await sdk.app.getParameters();

    this.setState(
      {
        parameters: parameters || {
          configUrl: '',
          mode: AssetSelectorMode.single,
        },
      },
      () => {
        // Once preparation has finished, call `setReady` to hide
        // the loading screen and present the app to a user.
        sdk.app.setReady();
      }
    );
  }

  onConfigure = async (): Promise<{
    parameters: AppInstallationParameters;
    targetState: AppState | null;
  }> => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const { sdk } = this.props;
    const { parameters } = this.state;
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  };

  updateConfigUrl = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    const {
      parameters: { mode },
    } = this.state;
    this.setState(
      {
        parameters: {
          configUrl: newValue,
          mode,
        },
      },
      () => {
        if (!validateUrl(newValue)) {
          this.setState({ validConfigUrl: false });
        } else {
          this.setState({ validConfigUrl: true });
        }
      }
    );
  };

  updateMode = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newMode = e.target.value as AssetSelectorMode;
    const {
      parameters: { configUrl },
    } = this.state;
    this.setState({
      parameters: {
        configUrl,
        mode: AssetSelectorMode[newMode],
      },
    });
  };

  render(): React.ReactNode {
    const {
      parameters: { configUrl, mode },
      validConfigUrl,
    } = this.state;
    return (
      <>
        <div className={bannerStyles} />
        <Workbench className={css({ margin: '50px' })}>
          <Card
            className={css({
              width: '60vw',
              margin: '0 auto',
              padding: '30px',
            })}
          >
            <Form>
              <Heading>About Adobe Experience Manager</Heading>
              <Paragraph>
                This app is a widget that allows editors to select media from
                AEM. Select a file on your AEM instance and designate the assets
                that you want your entry to reference.
              </Paragraph>
              <hr />
              <Heading>Configuration</Heading>
              <TextField
                id="configUrl"
                name="configUrl"
                labelText="AEM domain"
                helpText="The domain name to interact with the Adobe ExperienceManager. Example: author-danone-stage-64-b62-s3.adobecqms.net"
                validationMessage={
                  (!validConfigUrl && 'Please enter a valid URL') || undefined
                }
                value={configUrl}
                onChange={this.updateConfigUrl}
                required
              />
              <SelectField
                id="mode"
                name="mode"
                labelText="Asset selection mode"
                helpText="Defines if a single or multiple assets can be selected from AEM in a single field"
                value={mode}
                onChange={this.updateMode}
              >
                <Option value={AssetSelectorMode.single}>Single</Option>
                <Option value={AssetSelectorMode.multiple}>Multiple</Option>
              </SelectField>
            </Form>
          </Card>
        </Workbench>
      </>
    );
  }
}
