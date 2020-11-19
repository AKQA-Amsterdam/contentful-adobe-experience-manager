import React, { Component } from 'react';
import { AppState } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Form,
  Workbench,
  TextField,
  Paragraph,
  Card,
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import { validateDomainName, validatePath } from '../utils/validations';

import { AppInstallationParameters, ConfigProps, ConfigState } from './types';

const bannerStyles = css`
  height: 300px;
  background: #ccc;
  pointer-events: none;
`;

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      parameters: {
        configDomain: '',
        rootPath: '',
      },
      validConfigDomain: true,
      validPath: true,
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
          rootPath: '',
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
    const {
      parameters: { rootPath },
    } = this.state;

    this.setState(
      {
        parameters: {
          configDomain: newValue,
          rootPath,
        },
      },
      () => {
        if (!validateDomainName(newValue)) {
          this.setState({ validConfigDomain: false });
        } else {
          this.setState({ validConfigDomain: true });
        }
      }
    );
  };

  updateRootPath = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    const {
      parameters: { configDomain },
    } = this.state;

    this.setState(
      {
        parameters: {
          configDomain,
          rootPath: newValue,
        },
      },
      () => {
        if (!validatePath(newValue)) {
          this.setState({ validPath: false });
        } else {
          this.setState({ validPath: true });
        }
      }
    );
  };

  render(): React.ReactNode {
    const {
      parameters: { configDomain, rootPath },
      validConfigDomain,
      validPath,
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
                helpText="The domain of your Adobe Experience Manager instance. Example: example.adobecqms.net"
                validationMessage={
                  (!validConfigDomain && 'Please enter a valid Domain Name') ||
                  undefined
                }
                value={configDomain}
                onChange={this.updateConfigDomain}
                required
              />
              <TextField
                id="rootPath"
                name="rootPath"
                labelText="Root path"
                helpText="The path within AEM to set as the navigaton start within the Asset Selector. Please make sure the path is correct, as an invalid path will result  on the Asset selector displaying an error."
                validationMessage={
                  (!validPath && 'Please enter a valid path') || undefined
                }
                value={rootPath}
                onChange={this.updateRootPath}
              />
            </Form>
          </Card>
        </Workbench>
      </>
    );
  }
}
