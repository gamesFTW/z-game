function Collisions(){

}


Collisions.CATEGORY_PLAYER = 1;
Collisions.CATEGORY_MONSTER = 2;
Collisions.CATEGORY_BULLET = 4;
Collisions.CATEGORY_GAME_BORDER = 8;
Collisions.CATEGORY_WALL = 16;


Collisions.MASK_PLAYER  = Collisions.CATEGORY_MONSTER | Collisions.CATEGORY_BULLET | Collisions.CATEGORY_GAME_BORDER;
Collisions.MASK_MONSTER = Collisions.CATEGORY_PLAYER | Collisions.CATEGORY_BULLET;
Collisions.MASK_BULLET  = Collisions.CATEGORY_PLAYER | Collisions.CATEGORY_MONSTER | Collisions.CATEGORY_BULLET;
