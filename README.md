

# react-native-geocoder

[![CircleCI](https://circleci.com/gh/devfd/react-native-geocoder/tree/master.svg?style=shield)](https://circleci.com/gh/devfd/react-native-geocoder/tree/master)

geocoding services for react native


## Version table
| Geocoder Version | RN        |
| ------- |:----------|
| >=0.6.0   | >= 0.56.0 |
| >=0.5.0   | >= 0.47.0 |
| >=0.4.6   | >= 0.40.0 |
| <0.4.5    | <0.40.0   |



## Install
```
yarn add react-native-geocoder
```
or
```
npm install --save react-native-geocoder
```

## Link

### Automatically
Run
```
react-native link react-native-geocoder
```

### Manually
If automatic linking fails you can follow the manual installation steps

#### iOS

1. In the XCode's "Project navigator", right click on Libraries folder under your project ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `react-native-geocoder` and add `ios/RNGeocoder.xcodeproj` file
3. Add libRNGeocoder.a to "Build Phases" -> "Link Binary With Libraries"

#### Android

1. In `android/setting.gradle`

```gradle
...
include ':react-native-geocoder', ':app'
project(':react-native-geocoder').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-geocoder/android')
```

3. In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    implementation project(':react-native-geocoder')
}
```

4. register module (in MainApplication.java)

```java
import com.devfd.RNGeocoder.RNGeocoderPackage; // <--- import

public class MainActivity extends ReactActivity {
  ......

  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNGeocoderPackage()     // <------ add this
        ); 
  }

  ......

}

```

## Usage
```
import Geocoder from 'react-native-geocoder';

// Position Geocoding
var NY = {
  lat: 40.7809261,
  lng: -73.9637594
};

Geocoder.geocodePosition(NY).then(res => {
    // res is an Array of geocoding object (see below)
})
.catch(err => console.log(err))

// Address Geocoding
Geocoder.geocodeAddress('New York').then(res => {
    // res is an Array of geocoding object (see below)
})
.catch(err => console.log(err))
```

## Force to use google maps geocoding
```
import Geocoder from 'react-native-geocoder';
Geocoder.setApiKey(MY_KEY);
Geocoder.enableGoogleGeocoder()
// Position Geocoding
var NY = {
  lat: 40.7809261,
  lng: -73.9637594
};

Geocoder.geocodePosition(NY).then(res => {
    // res is an Array of geocoding object (see below) from google maps geocoding
})
.catch(err => console.log(err))

// Address Geocoding
Geocoder.geocodeAddress('New York').then(res => {
    // res is an Array of geocoding object (see below) from google maps geocoding
})
.catch(err => console.log(err))
```


## Fallback to google maps geocoding

Geocoding services might not be included in some Android devices (Kindle, some 4.1 devices, non-google devices). For those special cases the lib can fallback to the [online google maps geocoding service](https://developers.google.com/maps/documentation/geocoding/intro#Geocoding)

```js
import Geocoder from 'react-native-geocoder';
// simply add your google key
Geocoder.fallbackToGoogle(MY_KEY);

// use the lib as usual
let ret = await Geocoder.geocodePosition({lat, lng})

const locale = 'en'; // Two symbol locale code.
let ret = await Geocoder.geocodePosition({lat, lng}, locale);

// you get the same results

```

By default `locale` is 'en'.


## With async / await
```
try {

    const res = await Geocoder.geocodePosition(NY);
    ...

    const res = await Geocoder.geocodeAddress('London');
    ...
}
catch(err) {
    console.log(err);
}
```

## Geocoding object format
Android will return the following object:

```js
{
    position: {lat, lng},
    region: {
      center: {lat, lng},
      radius: Number,
    } | null,
    formattedAddress: String, // the full address
    feature: String | null, // ex Yosemite Park, Eiffel Tower
    streetNumber: String | null,
    streetName: String | null,
    postalCode: String | null,
    locality: String | null, // city name
    country: String,
    countryCode: String
    adminArea: String | null
    subAdminArea: String | null,
    subLocality: String | null
}
```

iOS will return that same object plus water feature data:

```js
{
    ocean: String | null,
    inlandWater: String | null
}
```

## Notes

### iOS
iOS does not allow sending multiple geocoding requests simultaneously, hence if you send a second call, the first one will be cancelled.

### Android
geocoding may not work on older android devices (4.1) and will not work if Google play services are not available.
`region` will always be `null` on Android since it doesn't support the feature. In this case, `Geocoder.geocodePositionFallback` and `Geocoder.geocodeAddressFallback` may be used to get the `region` value.
