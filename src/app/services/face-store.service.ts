import { Injectable } from '@angular/core';

@Injectable()
export class FacestoreService {
    knownFaces: Face[] = [];
    constructor() {
        this.knownFaces = JSON.parse(localStorage.getItem('knownFaces')) || [];
        console.log(this.knownFaces)
    }

    get faceIds(): string[] {
        return this.knownFaces.map(knownFace => knownFace.faceId) || []
    }

    addKonwnFace(faceId: string, nom: string, prenom: string): void {
        this.knownFaces.push(
            {
                faceId,
                nom,
                prenom
            }
        )
        localStorage.removeItem('knownFaces')
        localStorage.setItem('knownFaces', JSON.stringify(this.knownFaces));
    }
}

export interface Face {
    faceId: string,
    img?: string,
    nom?: string,
    prenom?: string
}