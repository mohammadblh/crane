import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../hooks/useApi';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [appConfig, setAppConfig] = useState({
    name: '',
    version: '1',
    logo: '',
    images: []
  });
  const [forms, setForms] = useState({
    rentalShort: null,
    rentalProject: null,
    rentalLong: null
  });
  // const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    // const config = await AsyncStorage.getItem('config')
    // console.log('bl', config)
    getCache();

    console.log('forms on storage:::',forms)
    // .then((res) => console.log('res async', res))
    // checkFirstLaunch();
    // checkUser();
  }, []);

  const getCache = async () => {
    let config = await AsyncStorage.getItem('config')
    let rentalLong = await AsyncStorage.getItem('rentalLong')
    let rentalShort = await AsyncStorage.getItem('rentalShort')
    let rentalProject = await AsyncStorage.getItem('rentalProject')

    config = JSON.parse(config);

    if(config)
    setAppConfig(config);
    setForms({
      rentalLong: JSON.parse(rentalLong),
      rentalProject: JSON.parse(rentalProject),
      rentalShort: JSON.parse(rentalShort)
    });
  }

  const setConfig = async (config) => {
    console.log(';setConfig;', forms)
    if(!config || (config.version === appConfig.version && forms.rentalLong && forms.rentalProject && forms.rentalShort)) {
      getForms();
      return;
    };

    try {
      setAppConfig({...appConfig, ...config})
      await AsyncStorage.setItem('config', JSON.stringify(config));
      getForms();
    } catch (error) {
      console.error('Error setting app config:', error);
    }
  };

  const getForms = async () => {
    const finger = await AsyncStorage.getItem('user_finger');
    if (!finger) return;

    const forms = await api.forms(finger);
    console.log('forms>>',forms)

    // if(!forms.success && forms.message === 'خطای کاربری')
    //   return <Redirect to="/login" />
    if(forms && !forms.success)
      return;

    console.log('forms.forms', forms.forms)
    const rentalShort = forms.forms.find((f) => f.name === 'rentalShort');
    const rentalProject = forms.forms.find((f) => f.name === 'rentalProject');
    const rentalLong = forms.forms.find((f) => f.name === 'rentalLong');

    console.log('rentalLong', rentalLong)
    console.log('rentalShort', rentalShort);
    console.log('rentalLong',rentalLong)
    if (rentalLong)
      await AsyncStorage.setItem('rentalLong', JSON.stringify(rentalLong));
    if (rentalShort)
      await AsyncStorage.setItem('rentalShort', JSON.stringify(rentalShort));
    if (rentalProject)
      await AsyncStorage.setItem('rentalProject', JSON.stringify(rentalProject))

    setForms({
      rentalLong,
      rentalProject,
      rentalShort
    });
  };

  return (
    <AppContext.Provider
      value={{
        version: appConfig.version,
        appName: appConfig.name,
        logo: appConfig.logo,
        images: appConfig.images,
        // rentalShort: null,
        rentalShort: forms.rentalShort,
        rentalProject: forms.rentalProject,
        rentalLong: forms.rentalLong,
        // loading,
        // isFirstLaunch,
        // completeOnboarding,
        // signUp,
        // signIn,
        // signOut,
        setConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
