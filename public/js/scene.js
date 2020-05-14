/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represent Triangle scene
 */
export class Scene {
    /**
     * Initializes the game with visual components.
     */
    constructor() {
      const view = document.getElementById('view');
      // initialize rendering and set correct sizing
      this.ratio = window.devicePixelRatio;
      this.renderer = PIXI.autoDetectRenderer({
        transparent: true,
        antialias: true,
        resolution: this.ratio,
        width: view.clientWidth,
        height: view.clientHeight,
      });
      this.element = this.renderer.view;
      this.element.style.width = `${this.renderer.width / this.ratio}px`;
      this.element.style.height = `${this.renderer.height / this.ratio}px`;
      view.appendChild(this.element);
      // center stage and normalize scaling for all resolutions
      this.stage = new PIXI.Container();
      this.stage.position.set(view.clientWidth / 2, view.clientHeight / 2);
      this.stage.scale.set(Math.max(this.renderer.width,
          this.renderer.height) / 1024);
      this.image = new PIXI.Sprite();
      this.image.scale.set(0.45);
      this.image.anchor.set(0.5);
      this.fact = new PIXI.Text('',
        {fontFamily : 'Arial', fontSize: 24, fill : 0x000000, align : 'center'});
      this.fact.scale.set(0.5);
      this.fact.anchor.set(0.5);
      this.fact.x = 0;
      this.fact.y = 150;
      const frame = () => {
        this.renderer.render(this.stage);
        requestAnimationFrame(frame);
      };
      frame();
    }

    /**
     * Restart game button to showcase sendTextQuery.
     */
    onUpdate(data) {
      this.image.texture = PIXI.Texture
        .fromImage(`assets/images/${data.image}`);
      this.fact.text = data.text;
      this.stage.addChild(this.image);
      this.stage.addChild(this.fact);
    }
  }