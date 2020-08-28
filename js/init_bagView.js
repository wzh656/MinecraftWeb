/*
* bag
*/
let bag_view = {
	camera: new THREE.PerspectiveCamera(70, 1, 0.01, 1000),
	scene: new THREE.Scene(),
	renderer: new THREE.WebGLRenderer({ antialias: true }),
	deskgood: {
		top: {},
		legs: []
	}
};
bag_view.camera.position.z = 260;
bag_view.renderer.setSize(100, 100);
bag_view.renderer.setClearColor("rgb(196,196,196)");
bag_view.renderer.domElement.id = "bag_deskgood";
$("#bag > div:eq(0)")[0].prepend( bag_view.renderer.domElement );

bag_view.geometry = new THREE.Geometry();

bag_view.deskgood.top.geometry = new THREE.BoxGeometry(150, 30, 100);
bag_view.deskgood.top.mesh = new THREE.Mesh(bag_view.deskgood.top.geometry);
bag_view.deskgood.top.mesh.position.y = 65;
bag_view.deskgood.top.mesh.updateMatrix();
bag_view.geometry.merge(bag_view.deskgood.top.mesh.geometry, bag_view.deskgood.top.mesh.matrix);

bag_view.deskgood.legs.geometry = new THREE.BoxGeometry(30, 100, 30);

bag_view.deskgood.legs[0] = {};
bag_view.deskgood.legs[0].mesh = new THREE.Mesh(bag_view.deskgood.legs.geometry);
bag_view.deskgood.legs[0].mesh.position.x = 150/2-30/2;
bag_view.deskgood.legs[0].mesh.position.z = 100/2-30/2;
bag_view.deskgood.legs[0].mesh.updateMatrix();
bag_view.geometry.merge(bag_view.deskgood.legs[0].mesh.geometry, bag_view.deskgood.legs[0].mesh.matrix);

bag_view.deskgood.legs[1] = {};
bag_view.deskgood.legs[1].mesh = new THREE.Mesh(bag_view.deskgood.legs.geometry);
bag_view.deskgood.legs[1].mesh.position.x = -(150/2-30/2);
bag_view.deskgood.legs[1].mesh.position.z = 100/2-30/2;
bag_view.deskgood.legs[1].mesh.updateMatrix();
bag_view.geometry.merge(bag_view.deskgood.legs[1].mesh.geometry, bag_view.deskgood.legs[1].mesh.matrix);

bag_view.deskgood.legs[2] = {};
bag_view.deskgood.legs[2].mesh = new THREE.Mesh(bag_view.deskgood.legs.geometry);
bag_view.deskgood.legs[2].mesh.position.x = 150/2-30/2;
bag_view.deskgood.legs[2].mesh.position.z = -(100/2-30/2);
bag_view.deskgood.legs[2].mesh.updateMatrix();
bag_view.geometry.merge(bag_view.deskgood.legs[2].mesh.geometry, bag_view.deskgood.legs[2].mesh.matrix);

bag_view.deskgood.legs[3] = {};
bag_view.deskgood.legs[3].mesh = new THREE.Mesh(bag_view.deskgood.legs.geometry);
bag_view.deskgood.legs[3].mesh.position.x = -(150/2-30/2);
bag_view.deskgood.legs[3].mesh.position.z = -(100/2-30/2);
bag_view.deskgood.legs[3].mesh.updateMatrix();
bag_view.geometry.merge(bag_view.deskgood.legs[3].mesh.geometry, bag_view.deskgood.legs[3].mesh.matrix);

bag_view.mesh = new THREE.Mesh(bag_view.geometry, new THREE.MeshBasicMaterial({
	map: new THREE.TextureLoader().load("img/deskgood.jpg")
}));
bag_view.mesh.rotation.x = Math.PI/4;
bag_view.scene.add(bag_view.mesh);

bag_view.controls = new THREE.OrbitControls(bag_view.camera, bag_view.renderer.domElement);//创建控件对象
setInterval(function(){
	bag_view.mesh.rotation.y += 0.02;
	bag_view.renderer.render(bag_view.scene, bag_view.camera);
},30);