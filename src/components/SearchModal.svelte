<script lang="ts">
    export let name: string;
</script>

  <div class="container">
    <a href="/search/result/?query={name}&sortby=current">
    <div class="image-thumbanil">
      <div class="video-container">
        <iframe
          class="recipe-img"
          src="https://www.youtube.com/embed/c5it8ttzJuY?autoplay=1&mute=1&loop=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="overlay"></div>
    </div>
    <div class="info">{name}</div>
    </a>
  </div>

  
  <style>
    .info {
      position: absolute;
      bottom: 5%;
      padding-left: 0.5rem;
      font-size: 1.25rem;
      color: white;
    }
  
    .image-thumbanil .video-container {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      overflow: hidden;
    }
  
    .image-thumbanil {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: var(--radius);
      overflow: hidden;
    }
  
    .container {
      margin: 1rem 0.7rem 0rem 0.3rem;
      width: calc(50% - 1rem);
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: var(--radius);
      overflow: hidden;
      aspect-ratio: 1 / 1;
      background-blend-mode: multiply;
    }
  
    .recipe-img {
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: -15%;
      top: -3%;
      left: 0%;
      right: 0%;
      transform: scale(1.9);
    }
  
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: var(--radius);
    }
  </style>
  