/*
view.ts负责视角相关内容
*/
import { core } from './core';

export class View {
    x: number;
    y: number;
    scale: number;
    id: string;
    width: number;
    height: number;

    constructor(id: string, x: number, y: number, scale: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.id = id;
    }

    /** 重新定位视角 */
    relocate(x: number, y: number): View {
        this.x = x;
        this.y = y;
        if (core.status.nowView.id === this.id) core.containers.map.position.set(x, y);
        return this;
    }

    /** 重新修改视角的视野范围 */
    resize(scale: number): View {
        this.scale = scale;
        if (core.status.nowView.id === this.id) {
            if (this.id === 'main') this.center();
            core.containers.map.scale.set(scale);
            core.containers.map.position.set(-this.x, -this.y);
        }
        return this;
    }

    /** 切换成该视角 */
    to(): View {
        if (core.status.thisMap) core.status.thisMap.draw(this);
        return core.status.nowView = this;
    }

    /** 切换视角至以勇士为中心 */
    center(): View {
        let hero = core.status.nowHero;
        if (!hero) return;
        this.calPixel();
        let x = 0;
        let y = 0;
        let dw = core.status.thisMap.width * core.status.thisMap.unit_width;
        let dh = core.status.thisMap.height * core.status.thisMap.unit_height;
        if (dw < this.width / this.scale) x = (-this.width / 2 + dw / 2) * this.scale;
        else {
            x = core.status.nowHero.x * core.status.thisMap.unit_width - this.width * this.scale / 2;
            if (x < 0) x = 0;
        }
        if (dh < this.height / this.scale) y = (-this.height / 2 + dh / 2) * this.scale;
        else {
            y = core.status.nowHero.y * core.status.thisMap.unit_height - this.height * this.scale / 2;
            if (y < 0) y = 0;
        }
        this.relocate(x, y);
        return this;
    }

    /** 计算视角的像素长宽 */
    calPixel(): View {
        this.width = 1000 / this.scale;
        this.height = 1000 / core.aspect / this.scale;
        return this;
    }
}

/**
 * 创建一个新的视角，不会切换至该视角，视角会存进core.status.views
 * @param id 视角id，不能是main
 */
export function createView(id: string, x: number, y: number, scale: number): View | void {
    if (id === 'main') return console.error('视角名称不能是main！');
    let view = new View(id, x, y, scale);
    return core.status.views[id] = view;
}