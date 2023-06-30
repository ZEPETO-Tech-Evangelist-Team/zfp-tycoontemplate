import {GameObject, HumanBodyBones, Transform, Vector3} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {LocalPlayer, SpawnInfo, ZepetoPlayers} from "ZEPETO.Character.Controller";
import {WorldService} from "ZEPETO.World";

export default class PlayerManager extends ZepetoScriptBehaviour {
    public spawnPoint: Transform;
    private dockPrefab: GameObject;

    public static dockPoint: Transform;
    
    Start() {
        let spawnInfo = new SpawnInfo();
        spawnInfo.position = this.spawnPoint.position;
        spawnInfo.rotation = this.spawnPoint.rotation;
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, spawnInfo, true);
        
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let localPlayer: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
            let playerTransform : Transform = localPlayer.zepetoPlayer.character.transform;
            PlayerManager.dockPoint = new GameObject("DockPoint").transform;
            PlayerManager.dockPoint.SetParent(playerTransform, false);
            PlayerManager.dockPoint.position += playerTransform.forward * 1.5;
        });
    }

}