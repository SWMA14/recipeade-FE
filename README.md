# recipeade-FE
![](https://media.discordapp.net/attachments/815214884920098817/1175887329798393967/front.png?ex=656cdd6a&is=655a686a&hm=07bfa57f26a5ad569c3b6b477bd28ee84f4a42e19465430dd5bdca5b859f284f&=&width=1920&height=622)

<div style="margin-bottom: 1rem;">
    <a href="https://apps.apple.com/kr/app/%EB%A0%88%EC%8B%9C%ED%94%BC%EC%97%90%EC%9D%B4%EB%93%9C/id6456039612" style="margin-right: 1rem;">
        <img src="https://media.discordapp.net/attachments/815214884920098817/1175893768185061467/apple.png?ex=656ce369&is=655a6e69&hm=dd78cee6c407c1db12fddcd6be097350682544d7c2cd2dd1eb34bfd5765db19c" alt="App Store" style="width: 300px;">
    </a>
    <a href="https://play.google.com/store/apps/details?id=com.recipeade.svelte">
        <img src="https://media.discordapp.net/attachments/815214884920098817/1175893768415760384/google.png?ex=656ce369&is=655a6e69&hm=4679ca4e462687d7ba4dd13bcb7e58d9f5a3527c6016511750452f87353879da" alt="Google Play" style="width: 300px;">
    </a>
</div>

레시피에이드의 모바일 어플리케이션입니다.

## 기술 스택
* 프레임워크: [SvelteKit](https://svelte.dev)
* 크로스 플랫폼: [Capacitor](https://capacitorjs.com)
* 손 인식: [MeiaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)

## 기능
* 원하는 요리 영상을 레시피로 변환
* 다른 사용자가 저장한 레시피 탐색
* 저장한 레시피를 자유롭게 편집
* 요리 모드로 편리하게 요리 진행
* 음성 인식으로 수조작 없이 영상 제어
* 요리 중 어시스턴트에게 궁금한 정보 질문
* 요리 영상 댓글 분석으로 유용한 정보 제공

## 폴더 구조
```
.
├── README.md
├── android
│   ├── app
│   │   ├── build
│   │   ├── build.gradle
│   │   ├── capacitor.build.gradle
│   │   ├── google-services.json
│   │   ├── proguard-rules.pro
│   │   └── src
│   ├── build.gradle
│   ├── capacitor-cordova-android-plugins
│   │   ├── build
│   │   ├── build.gradle
│   │   ├── cordova.variables.gradle
│   │   └── src
│   ├── capacitor.settings.gradle
│   ├── gradle
│   │   └── wrapper
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── settings.gradle
│   └── variables.gradle
├── assets
│   └── icon.png
├── capacitor.config.ts
├── icons
│   ├── icon-128.webp
│   ├── icon-192.webp
│   ├── icon-256.webp
│   ├── icon-48.webp
│   ├── icon-512.webp
│   ├── icon-72.webp
│   └── icon-96.webp
├── ios
│   ├── App
│   │   ├── App
│   │   ├── App.xcodeproj
│   │   ├── App.xcworkspace
│   │   ├── Podfile
│   │   └── Podfile.lock
│   └── capacitor-cordova-ios-plugins
│       ├── CordovaPlugins.podspec
│       ├── CordovaPluginsResources.podspec
│       ├── CordovaPluginsStatic.podspec
│       ├── resources
│       └── sources
├── package-lock.json
├── package.json
├── postcss.config.js
├── resources
│   └── icon.png
├── src
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   ├── components
│   │   ├── AlertDrawer.svelte
│   │   ├── AsymmetricGrid.svelte
│   │   ├── Badge.svelte
│   │   ├── Button.svelte
│   │   ├── Card.svelte
│   │   ├── Carousel.svelte
│   │   ├── ConfirmationDrawer.svelte
│   │   ├── Drawer.svelte
│   │   ├── DynamicBar.svelte
│   │   ├── FilterModal.svelte
│   │   ├── Ingredient.svelte
│   │   ├── Input.svelte
│   │   ├── Modal.svelte
│   │   ├── Review.svelte
│   │   ├── SearchModal.svelte
│   │   ├── Skeleton.svelte
│   │   ├── Stack.svelte
│   │   ├── Step.svelte
│   │   ├── Tooltip.svelte
│   │   ├── Video.svelte
│   │   ├── __alertDrawerLowerBarComponents
│   │   ├── __confirmationDrawerLowerBarComponents
│   │   └── __stackUpperBarComponents
│   ├── lib
│   │   ├── analytics.ts
│   │   ├── assistant.ts
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   ├── dummy.ts
│   │   ├── dynamicBar.ts
│   │   ├── i18n
│   │   ├── pausableTween.ts
│   │   ├── search.ts
│   │   ├── tag.ts
│   │   ├── transition.ts
│   │   ├── types.ts
│   │   └── video.ts
│   ├── routes
│   │   ├── +layout.svelte
│   │   ├── +layout.ts
│   │   ├── +page.svelte
│   │   ├── [id]
│   │   ├── __lowerBarComponents
│   │   ├── __upperBarComponents
│   │   ├── api
│   │   ├── discover
│   │   ├── login
│   │   ├── search
│   │   └── settings
│   └── store.ts
├── static
│   ├── favicon.png
│   ├── images
│   │   ├── guide-link-copy.png
│   │   ├── icon-transparent.png
│   │   ├── landing-1.png
│   │   ├── landing-2.png
│   │   ├── landing-3.png
│   │   ├── landing-4.png
│   │   ├── no-result.png
│   │   ├── thumbnail.png
│   │   └── typo.png
│   └── videos
│       ├── landing-1.mp4
│       ├── landing-2.mp4
│       └── landing-3.mp4
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 개발 인원
|[김민석](https://github.com/rlaminseok0824)|[황시우](https://github.com/dvrp0)|
|:-:|:-:|
|<img src="https://avatars.githubusercontent.com/u/114082574?v=4" alt="김민석" width="75" height="75">|<img src="https://avatars.githubusercontent.com/u/26036938?v=4" alt="황시우" width="75" height="75">||