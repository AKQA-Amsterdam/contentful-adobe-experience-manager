import React, { Component } from 'react';
import { AppExtensionSDK, AppState } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Form,
  Workbench,
  TextField,
  Paragraph,
  Card,
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
  configDomain: string;
}

export interface AppInstanceParameters {
  mode: AssetSelectorMode;
}

export interface ConfigProps {
  sdk: AppExtensionSDK;
}

export interface ConfigState {
  parameters: AppInstallationParameters;
  validConfigDomain: boolean;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      parameters: {
        configDomain: '',
      },
      validConfigDomain: true,
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
          configDomain: '',
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

  updateConfigDomain = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;

    this.setState(
      {
        parameters: {
          configDomain: newValue,
        },
      },
      () => {
        if (!validateUrl(newValue)) {
          this.setState({ validConfigDomain: false });
        } else {
          this.setState({ validConfigDomain: true });
        }
      }
    );
  };

  render(): React.ReactNode {
    const {
      parameters: { configDomain },
      validConfigDomain,
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
                id="configDomain"
                name="configDomain"
                labelText="AEM domain"
                helpText="The domain name to interact with the Adobe ExperienceManager (without https:// at the start and without / at the end). Example: author-anon-stage-00-000-00.adobecqms.net"
                validationMessage={
                  (!validConfigDomain && 'Please enter a valid URL') ||
                  undefined
                }
                value={configDomain}
                onChange={this.updateConfigDomain}
                required
              />
            </Form>
          </Card>
        </Workbench>
      </>
    );
  }
}
